/**
 * Vercel Serverless Function that receives contact form submissions,
 * emails them to the Moswen Designs team via Resend, and sends a branded
 * confirmation email back to the lead.
 * Exposes a POST endpoint at /api/crm.
 */

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

const LOGO_URL = 'https://moswendesigns.com/assets/images/logo/logo-email.png';

const SOCIAL_LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/moswen_designs/' },
  { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61559017957866' },
];

const FIELD_LABELS = {
  nombre: 'Nombre completo',
  email: 'Correo electrónico',
  telefono: 'Teléfono',
  interes: 'Servicio de interés',
  presupuesto: 'Presupuesto estimado',
  objetivo: 'Objetivo (Crédito)',
  detalles: 'Detalles del proyecto',
  mensaje: 'Mensaje',
};

// Internal notification email (to the Moswen team)
function buildTeamEmailHtml(body) {
  const rows = Object.entries(FIELD_LABELS)
    .filter(([key]) => body[key])
    .map(([key, label]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#333;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;color:#333;">${escapeHtml(String(body[key]))}</td>
      </tr>`)
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background-color:#111111;padding:16px;text-align:center;margin-bottom:20px;">
        <img src="${LOGO_URL}" width="60" alt="Moswen Design's" style="display:block;margin:0 auto;width:60px;height:auto;border:0;">
      </div>
      <h2 style="color:#f6a332;">Nuevo lead desde el sitio web</h2>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>`;
}

// Branded confirmation email sent back to the lead/client
function buildClientConfirmationHtml(body) {
  const nombre = escapeHtml(body.nombre || 'ahí');
  const interes = body.interes ? escapeHtml(body.interes) : null;

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111111;padding:28px 32px;text-align:center;">
              <img src="${LOGO_URL}" width="90" alt="Moswen Design's" style="display:block;margin:0 auto;width:90px;height:auto;border:0;">
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
                    Un asesor revisará los detalles de tu proyecto y te contactará dentro de las próximas 24 horas hábiles para agendar tu sesión estratégica gratuita.
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 32px 0;font-size:15px;line-height:1.6;color:#333333;">
                Mientras tanto, puedes conocer más sobre cómo trabajamos en
                <a href="https://moswendesigns.com" style="color:#f6a332;text-decoration:none;font-weight:600;">moswendesigns.com</a>.
              </p>
              <p style="margin:0 0 4px 0;font-size:15px;color:#333333;">Saludos,</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#111111;">El equipo de Moswen Designs</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#111111;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 12px 0;font-size:12px;">
                ${SOCIAL_LINKS.map(s => `<a href="${escapeHtml(s.url)}" style="color:#f6a332;text-decoration:none;font-weight:600;margin:0 8px;">${escapeHtml(s.label)}</a>`).join('<span style="color:#444444;">•</span>')}
              </p>
              <p style="margin:0 0 4px 0;font-size:12px;color:#888888;letter-spacing:1px;">© 2026 MOSWEN DESIGNS | AGENCIA TECNOLÓGICA Y CREATIVA</p>
              <p style="margin:0;font-size:12px;color:#888888;">info@moswendesigns.com &nbsp;•&nbsp; moswendesigns.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

async function sendResendEmail(apiKey, payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return response;
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

// Creates a Person + Note (with the lead's message) in Twenty CRM.
// Best-effort: any failure here is logged but never fails the request,
// since the team notification email above is the source of truth for the lead.
async function createTwentyLead(apiUrl, apiKey, body) {
  const twentyFetch = (path, payload) =>
    fetch(`${apiUrl}/rest/${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

  const personResponse = await twentyFetch('people', {
    name: splitName(body.nombre),
    emails: body.email ? { primaryEmail: body.email } : undefined,
    phones: body.telefono ? { primaryPhoneNumber: body.telefono } : undefined,
  });

  if (!personResponse.ok) {
    throw new Error(`Twenty createPerson failed (${personResponse.status}): ${await personResponse.text()}`);
  }

  const personData = await personResponse.json();
  const personId = personData.data.createPerson.id;

  const noteLines = Object.entries(FIELD_LABELS)
    .filter(([key]) => key !== 'nombre' && key !== 'email' && body[key])
    .map(([key, label]) => `**${label}:** ${body[key]}`)
    .join('\n\n');

  const noteResponse = await twentyFetch('notes', {
    title: `Lead del sitio web: ${body.nombre || body.email}`,
    bodyV2: { markdown: noteLines || 'Sin detalles adicionales.' },
  });

  if (!noteResponse.ok) {
    throw new Error(`Twenty createNote failed (${noteResponse.status}): ${await noteResponse.text()}`);
  }

  const noteData = await noteResponse.json();
  const noteId = noteData.data.createNote.id;

  const noteTargetResponse = await twentyFetch('noteTargets', {
    noteId,
    targetPersonId: personId,
  });

  if (!noteTargetResponse.ok) {
    throw new Error(`Twenty createNoteTarget failed (${noteTargetResponse.status}): ${await noteTargetResponse.text()}`);
  }
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};

    if (!body.nombre && !body.email) {
      return res.status(400).json({ error: 'Faltan datos del formulario (nombre o email).' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.LEAD_TO_EMAIL;

    if (!resendApiKey || !fromEmail || !toEmail) {
      console.error('Resend configuration missing in Environment Variables.');
      return res.status(500).json({
        error: 'Servidor no configurado para envío de leads. Faltan variables de entorno de Resend.',
      });
    }

    const subject = `Nuevo lead: ${body.nombre || body.email}${body.interes ? ` — ${body.interes}` : ''}`;

    const teamResponse = await sendResendEmail(resendApiKey, {
      from: fromEmail,
      to: [toEmail],
      reply_to: body.email || undefined,
      subject,
      html: buildTeamEmailHtml(body),
    });

    if (!teamResponse.ok) {
      const errorText = await teamResponse.text();
      console.error('Resend API error (team notification):', teamResponse.status, errorText);
      return res.status(502).json({ error: 'No se pudo enviar el correo del lead.' });
    }

    // Best-effort confirmation email to the lead — failure here shouldn't fail the whole request,
    // since the lead was already captured by the team notification above.
    let confirmationSent = false;
    if (body.email) {
      try {
        const clientResponse = await sendResendEmail(resendApiKey, {
          from: fromEmail,
          to: [body.email],
          subject: '¡Gracias por contactar a Moswen Designs!',
          html: buildClientConfirmationHtml(body),
        });
        confirmationSent = clientResponse.ok;
        if (!clientResponse.ok) {
          console.error('Resend API error (client confirmation):', clientResponse.status, await clientResponse.text());
        }
      } catch (confirmationError) {
        console.error('Error sending client confirmation email:', confirmationError);
      }
    }

    // Best-effort: also register the lead in Twenty CRM. Failure here shouldn't
    // fail the whole request — the team already got the notification email.
    let crmSynced = false;
    const twentyApiUrl = process.env.TWENTY_API_URL;
    const twentyApiKey = process.env.TWENTY_API_KEY;
    if (twentyApiUrl && twentyApiKey) {
      try {
        await createTwentyLead(twentyApiUrl, twentyApiKey, body);
        crmSynced = true;
      } catch (crmError) {
        console.error('Error syncing lead to Twenty CRM:', crmError);
      }
    }

    return res.status(200).json({ success: true, confirmationSent, crmSynced });
  } catch (error) {
    console.error('Error in Vercel CRM proxy function:', error);
    return res.status(500).json({ error: 'Error interno del servidor al procesar el formulario.' });
  }
};
