/**
 * Vercel Serverless Function that receives contact form submissions and
 * emails them to the Moswen Designs team via Resend.
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

function buildEmailHtml(body) {
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
      <h2 style="color:#f6a332;">Nuevo lead desde el sitio web</h2>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>`;
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

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: body.email || undefined,
        subject,
        html: buildEmailHtml(body),
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, errorText);
      return res.status(502).json({ error: 'No se pudo enviar el correo del lead.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in Vercel CRM proxy function:', error);
    return res.status(500).json({ error: 'Error interno del servidor al procesar el formulario.' });
  }
};
