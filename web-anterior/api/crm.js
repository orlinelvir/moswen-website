/**
 * Vercel Serverless Function that receives the contact-form submissions.
 *
 * Flow: validate -> send the lead to Go High Level (inbound webhook, the lead of record)
 *       -> in parallel, email the Moswen team and send a branded confirmation to the lead (Resend).
 * The request succeeds when GHL OR the team email worked, so a single outage never loses a lead.
 *
 * Environment variables:
 *   GHL_WEBHOOK_URL   Inbound Webhook URL of the GHL workflow (optional until it is created)
 *   RESEND_API_KEY, RESEND_FROM_EMAIL, LEAD_TO_EMAIL   (required for the emails)
 *
 * Exposes a POST endpoint at /api/crm.
 */

const LOGO_URL = 'https://www.moswen.app/assets/images/logo/logo-email.png';
const SITE_URL = 'https://www.moswen.app';

const SOCIAL_LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/moswen_designs/' },
  { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61559017957866' },
];

// Allowed fields and their maximum length. Anything else in the body is ignored.
const FIELD_LIMITS = {
  nombre: 80,
  email: 120,
  telefono: 30,
  pais: 30,
  interes: 60,
  presupuesto: 60,
  detalles: 1000,
  consentimiento: 5,
  fuente: 60,
  referido: 40,
  utm_source: 100,
  utm_medium: 100,
  utm_campaign: 100,
  utm_content: 100,
  utm_term: 100,
  fbclid: 100,
  landing: 100,
  referrer: 200,
};

const FIELD_LABELS = {
  nombre: 'Nombre completo',
  email: 'Correo electrónico',
  telefono: 'WhatsApp',
  pais: 'País',
  interes: 'Servicio de interés',
  presupuesto: 'Presupuesto estimado',
  detalles: 'Detalles del proyecto',
  fuente: 'Página de origen',
  referido: 'Código de referido',
  utm_source: 'utm_source',
  utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign',
  utm_content: 'utm_content',
  utm_term: 'utm_term',
  fbclid: 'fbclid',
  landing: 'Primera página visitada',
  referrer: 'Referrer',
};

const SERVICE_TAGS = {
  'Marca e identidad visual': 'srv:marca',
  'Landing page': 'srv:landing',
  'Sitio web premium': 'srv:sitio',
  'Anuncios en Meta': 'srv:ads',
  'Agente virtual con IA': 'srv:agente-ia',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FETCH_TIMEOUT_MS = 6000;

// Helper to escape special HTML characters (prevents HTML/markup injection in the email body)
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[&<>"']/g, function (c) {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case '\'': return '&#39;';
      default: return c;
    }
  });
}

function sanitizeBody(raw) {
  const clean = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return clean;
  for (const [key, max] of Object.entries(FIELD_LIMITS)) {
    const value = raw[key];
    if (typeof value !== 'string') continue;
    // eslint-disable-next-line no-control-regex
    const trimmed = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
    if (trimmed) clean[key] = trimmed;
  }
  return clean;
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

// Best-effort E.164 normalisation for Honduras (+504) and the US (+1).
function normalizePhone(phone, country) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (phone.trim().startsWith('+')) return `+${digits}`;
  if (country === 'Honduras' && digits.length === 8) return `+504${digits}`;
  if (country === 'Estados Unidos' && digits.length === 10) return `+1${digits}`;
  if (digits.length >= 11) return `+${digits}`;
  return digits;
}

// Simple per-instance rate limit (best effort on serverless): 5 submissions / 10 minutes / IP.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, list] of hits) {
      if (!list.some((t) => now - t < windowMs)) hits.delete(key);
    }
  }
  return recent.length > 5;
}

function originAllowed(origin) {
  if (!origin) return true; // same-origin form posts may omit it
  if (origin === 'https://www.moswen.app' || origin === 'https://moswen.app') return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Internal notification email (to the Moswen team)
function buildTeamEmailHtml(data, phoneE164) {
  const rows = Object.entries(FIELD_LABELS)
    .filter(([key]) => data[key])
    .map(([key, label]) => {
      let value = escapeHtml(String(data[key]));
      if (key === 'telefono' && phoneE164) {
        const digits = phoneE164.replace(/\D/g, '');
        value += ` &nbsp;<a href="https://wa.me/${digits}" style="color:#f6a332;">Abrir WhatsApp</a>`;
      }
      return `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#333;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;color:#333;">${value}</td>
      </tr>`;
    })
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background-color:#111111;padding:16px;text-align:center;margin-bottom:20px;">
        <img src="${LOGO_URL}" width="60" alt="Moswen Designs" style="display:block;margin:0 auto;width:60px;height:auto;border:0;">
      </div>
      <h2 style="color:#f6a332;">Nuevo lead desde el sitio web</h2>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>`;
}

// Branded confirmation email sent back to the lead
function buildClientConfirmationHtml(data) {
  const nombre = escapeHtml(data.nombre || '');
  const interes = data.interes ? escapeHtml(data.interes) : null;

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111111;padding:28px 32px;text-align:center;">
              <img src="${LOGO_URL}" width="90" alt="Moswen Designs" style="display:block;margin:0 auto;width:90px;height:auto;border:0;">
            </td>
          </tr>
          <tr>
            <td style="padding:40px 36px 8px 36px;">
              <h1 style="margin:0 0 16px 0;font-size:22px;color:#111111;">¡Hola, ${nombre}!</h1>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
                Gracias por contactar a <strong>Moswen Designs</strong>${interes ? `. Recibimos tu solicitud sobre <strong style="color:#f6a332;">${interes}</strong>` : ', recibimos tu mensaje'} y ya está en manos de nuestro equipo.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f5ef;border-left:4px solid #f6a332;border-radius:6px;margin:24px 0;">
                <tr>
                  <td style="padding:18px 20px;font-size:14px;line-height:1.6;color:#333333;">
                    <strong>¿Qué sigue?</strong><br>
                    Te respondemos el mismo día hábil. Para ir más rápido, reserva ahora tu consulta de 30 minutos y elige el horario que te convenga.
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 28px 0;text-align:center;">
                <a href="${SITE_URL}/gracias" style="display:inline-block;background-color:#f6a332;color:#111111;font-weight:700;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:6px;">Reservar mi consulta</a>
              </p>
              <p style="margin:16px 0 32px 0;font-size:15px;line-height:1.6;color:#333333;">
                Mientras tanto, puedes ver nuestro trabajo en
                <a href="${SITE_URL}" style="color:#f6a332;text-decoration:none;font-weight:600;">moswen.app</a>.
              </p>
              <p style="margin:0 0 4px 0;font-size:15px;color:#333333;">Saludos,</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#111111;">El equipo de Moswen Designs</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#111111;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 12px 0;font-size:12px;">
                ${SOCIAL_LINKS.map((s) => `<a href="${escapeHtml(s.url)}" style="color:#f6a332;text-decoration:none;font-weight:600;margin:0 8px;">${escapeHtml(s.label)}</a>`).join('<span style="color:#444444;">•</span>')}
              </p>
              <p style="margin:0 0 4px 0;font-size:12px;color:#888888;letter-spacing:1px;">© 2026 MOSWEN DESIGNS | MARCA, WEB Y ANUNCIOS</p>
              <p style="margin:0;font-size:12px;color:#888888;">info@moswen.app &nbsp;•&nbsp; moswen.app</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

async function sendResendEmail(apiKey, payload) {
  const response = await fetchWithTimeout('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
  return true;
}

// Sends the lead to the Go High Level inbound webhook (flat JSON, mapped inside the GHL workflow).
async function sendToGhl(webhookUrl, data, phoneE164) {
  const { firstName, lastName } = splitName(data.nombre);
  const tags = ['web-lead'];
  if (data.fuente && data.fuente.toLowerCase().includes('brokers')) tags.push('brokers');
  if (data.referido) tags.push(`ref:${data.referido.toLowerCase()}`);
  if (SERVICE_TAGS[data.interes]) tags.push(SERVICE_TAGS[data.interes]);

  const payload = {
    first_name: firstName,
    last_name: lastName,
    full_name: data.nombre,
    email: data.email,
    phone: phoneE164,
    country: data.pais || '',
    source: `moswen.app${data.fuente || '/'}`,
    tags,
    tags_csv: tags.join(','),
    servicio_interes: data.interes || '',
    presupuesto: data.presupuesto || '',
    detalles: data.detalles || '',
    consentimiento: data.consentimiento || '',
    fecha_consentimiento: new Date().toISOString(),
    referido_codigo: data.referido || '',
    utm_source: data.utm_source || '',
    utm_medium: data.utm_medium || '',
    utm_campaign: data.utm_campaign || '',
    utm_content: data.utm_content || '',
    utm_term: data.utm_term || '',
    fbclid: data.fbclid || '',
    landing: data.landing || '',
    referrer: data.referrer || '',
  };

  const response = await fetchWithTimeout(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`GHL webhook ${response.status}`);
  }
  return true;
}

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (!originAllowed(origin)) {
    return res.status(403).json({ error: 'Origen no permitido.' });
  }
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const raw = req.body && typeof req.body === 'object' ? req.body : {};

    // Honeypot: bots fill the hidden "website" field. Pretend success, do nothing.
    if (typeof raw.website === 'string' && raw.website.trim() !== '') {
      return res.status(200).json({ success: true });
    }

    const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ip = forwarded || (req.socket && req.socket.remoteAddress) || 'unknown';
    if (rateLimited(ip)) {
      return res.status(429).json({ error: 'Demasiados envíos. Intenta de nuevo en unos minutos.' });
    }

    const data = sanitizeBody(raw);

    if (!data.nombre || data.nombre.length < 2) {
      return res.status(400).json({ error: 'Escribe tu nombre.' });
    }
    if (!data.email || !EMAIL_RE.test(data.email)) {
      return res.status(400).json({ error: 'Escribe un correo electrónico válido.' });
    }
    if (data.consentimiento !== 'si') {
      return res.status(400).json({ error: 'Debes aceptar la política de privacidad para continuar.' });
    }

    const ghlUrl = process.env.GHL_WEBHOOK_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.LEAD_TO_EMAIL;
    const resendConfigured = Boolean(resendApiKey && fromEmail && toEmail);

    if (!ghlUrl && !resendConfigured) {
      console.error('No destination configured: set GHL_WEBHOOK_URL and/or the Resend variables.');
      return res.status(500).json({ error: 'Servidor no configurado para recibir leads.' });
    }

    const phoneE164 = normalizePhone(data.telefono, data.pais);
    const refTag = data.referido ? ` [Ref: ${data.referido}]` : '';
    const subject = `Nuevo lead${refTag}: ${data.nombre}${data.interes ? ` — ${data.interes}` : ''}`;

    const ghlPromise = ghlUrl ? sendToGhl(ghlUrl, data, phoneE164) : Promise.resolve(false);
    const teamPromise = resendConfigured
      ? sendResendEmail(resendApiKey, {
          from: fromEmail,
          to: [toEmail],
          reply_to: data.email,
          subject,
          html: buildTeamEmailHtml(data, phoneE164),
        })
      : Promise.resolve(false);
    const clientPromise = resendConfigured
      ? sendResendEmail(resendApiKey, {
          from: fromEmail,
          to: [data.email],
          subject: '¡Gracias por contactar a Moswen Designs!',
          html: buildClientConfirmationHtml(data),
        })
      : Promise.resolve(false);

    const [ghl, team, client] = await Promise.allSettled([ghlPromise, teamPromise, clientPromise]);
    const ghlOk = ghl.status === 'fulfilled' && ghl.value === true;
    const teamOk = team.status === 'fulfilled' && team.value === true;
    const clientOk = client.status === 'fulfilled' && client.value === true;

    if (ghl.status === 'rejected') console.error('GHL webhook failed:', ghl.reason && ghl.reason.message);
    if (team.status === 'rejected') console.error('Team email failed:', team.reason && team.reason.message);
    if (client.status === 'rejected') console.error('Confirmation email failed:', client.reason && client.reason.message);

    if (!ghlOk && !teamOk) {
      return res.status(502).json({ error: 'No se pudo registrar tu solicitud. Escríbenos a info@moswen.app.' });
    }

    return res.status(200).json({ success: true, crmSynced: ghlOk, confirmationSent: clientOk });
  } catch (error) {
    console.error('Error in /api/crm:', error);
    return res.status(500).json({ error: 'Error interno del servidor al procesar el formulario.' });
  }
};
