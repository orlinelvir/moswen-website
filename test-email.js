/**
 * Standalone script to preview/test the Moswen Designs client confirmation
 * email template by sending it to yourself via Resend.
 *
 * Usage (PowerShell):
 *   $env:RESEND_API_KEY="re_xxxxxxxx"
 *   $env:RESEND_FROM_EMAIL="Moswen Designs <info@moswendesigns.com>"
 *   $env:TEST_TO_EMAIL="tu-correo@ejemplo.com"
 *   node test-email.js
 *
 * Requires Node.js 18+ (for global fetch).
 * Este archivo es solo para pruebas locales — no se despliega ni se sube al repo.
 */

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

function buildClientConfirmationHtml({ nombre, interes }) {
  const safeNombre = escapeHtml(nombre || 'ahí');
  const safeInteres = interes ? escapeHtml(interes) : null;

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
              <h1 style="margin:0 0 16px 0;font-size:22px;color:#111111;">¡Hola, ${safeNombre}!</h1>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
                Gracias por contactar a <strong>Moswen Designs</strong>${safeInteres ? `. Recibimos tu solicitud sobre <strong style="color:#f6a332;">${safeInteres}</strong>` : ', recibimos tu mensaje'} y ya está en manos de nuestro equipo.
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

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.TEST_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error('Faltan variables de entorno. Define RESEND_API_KEY, RESEND_FROM_EMAIL y TEST_TO_EMAIL antes de correr este script.');
    process.exit(1);
  }

  // Edita estos valores para simular distintos leads/servicios
  const testLead = {
    nombre: 'Fernando (prueba)',
    interes: 'Desarrollo Web y Apps',
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: '[PRUEBA] ¡Gracias por contactar a Moswen Designs!',
      html: buildClientConfirmationHtml(testLead),
    }),
  });

  if (!response.ok) {
    console.error('Error al enviar:', response.status, await response.text());
    process.exit(1);
  }

  const data = await response.json();
  console.log('Correo de prueba enviado con éxito. ID:', data.id);
}

main();
