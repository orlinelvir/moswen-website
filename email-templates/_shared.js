/**
 * Shared building blocks for Moswen Designs client email templates.
 * Used by every script in this folder — keeps logo, footer, and sending
 * logic consistent across templates.
 *
 * Not deployed — these are internal tools run locally with `node <file>.js`.
 */

const LOGO_URL = 'https://moswendesigns.com/assets/images/logo/logo-email.png';

const SOCIAL_LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/moswen_designs/' },
  { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61559017957866' },
];

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

// Wraps template-specific inner HTML with the shared branded header/footer shell.
function wrapEmailBody(innerHtml) {
  const socialsHtml = SOCIAL_LINKS
    .map(s => `<a href="${escapeHtml(s.url)}" style="color:#f6a332;text-decoration:none;font-weight:600;margin:0 8px;">${escapeHtml(s.label)}</a>`)
    .join('<span style="color:#444444;">•</span>');

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
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#111111;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 12px 0;font-size:12px;">${socialsHtml}</p>
              <p style="margin:0 0 4px 0;font-size:12px;color:#888888;letter-spacing:1px;">© 2026 MOSWEN DESIGNS | AGENCIA TECNOLÓGICA Y CREATIVA</p>
              <p style="margin:0;font-size:12px;color:#888888;">info@moswendesigns.com &nbsp;•&nbsp; moswendesigns.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

// Reusable "callout box" used across templates for highlighted info (next steps, checklists, etc.)
function calloutBox(titleHtml, bodyHtml) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f5ef;border-left:4px solid #f6a332;border-radius:6px;margin:24px 0;">
      <tr>
        <td style="padding:18px 20px;font-size:14px;line-height:1.6;color:#333333;">
          <strong>${titleHtml}</strong><br>
          ${bodyHtml}
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

// Reads the 3 required env vars and sends `html` with `subject` to `to`.
async function sendFromEnv({ subject, html, to: toOverride }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = toOverride || process.env.CLIENT_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error('Faltan variables de entorno. Define RESEND_API_KEY, RESEND_FROM_EMAIL y CLIENT_EMAIL antes de correr este script.');
    process.exit(1);
  }

  const response = await sendResendEmail(apiKey, {
    from: fromEmail,
    to: [toEmail],
    subject,
    html,
  });

  if (!response.ok) {
    console.error('Error al enviar:', response.status, await response.text());
    process.exit(1);
  }

  const data = await response.json();
  console.log(`Correo enviado a ${toEmail}. ID:`, data.id);
}

module.exports = { LOGO_URL, SOCIAL_LINKS, escapeHtml, wrapEmailBody, calloutBox, sendResendEmail, sendFromEnv };
