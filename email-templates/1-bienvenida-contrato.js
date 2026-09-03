/**
 * PLANTILLA 1: Bienvenida + Contrato
 * Cuándo usarla: el cliente acepta la propuesta/cotización (paso "Diagnóstico & Firma").
 *
 * Cómo usarla:
 *   1. Edita el objeto CLIENTE abajo con los datos de este cliente.
 *   2. En PowerShell, define las variables de entorno:
 *        $env:RESEND_API_KEY="re_xxxxxxxx"
 *        $env:RESEND_FROM_EMAIL="Moswen Designs <info@moswendesigns.com>"
 *        $env:CLIENT_EMAIL="correo-del-cliente@ejemplo.com"
 *   3. Corre: node 1-bienvenida-contrato.js
 */

const { escapeHtml, wrapEmailBody, calloutBox, sendFromEnv } = require('./_shared');

// ── Edita estos datos para cada cliente ──────────────────────────────────
const CLIENTE = {
  nombre: 'Nombre del Cliente',
  servicio: 'Website Corporativo',           // ej. "Plan Growth (Lead Generation)", "Starter Identity", etc.
  inversion: '$1,200 USD',                   // monto acordado
  tipoPago: 'unico',                         // 'unico' (50%/50%) o 'retainer' (100% adelantado mensual)
  contractLink: 'https://ejemplo.com/contrato-cliente.pdf', // link al contrato (o deja como referencia si va adjunto)
};
// ──────────────────────────────────────────────────────────────────────────

function paymentPolicyText(tipoPago) {
  if (tipoPago === 'retainer') {
    return 'Al ser un servicio de retainer mensual, la política es <strong>100% por adelantado al inicio de cada mes operativo</strong>.';
  }
  return 'La política de pago es <strong>50% de anticipo para iniciar</strong> y <strong>50% contra entrega</strong> del proyecto terminado.';
}

function buildHtml(c) {
  const inner = `
    <h1 style="margin:0 0 16px 0;font-size:22px;color:#111111;">¡Bienvenido a Moswen Designs, ${escapeHtml(c.nombre)}!</h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
      Estamos muy contentos de trabajar contigo. Confirmamos los detalles de tu proyecto:
    </p>
    ${calloutBox('Resumen de tu proyecto', `
      Servicio: <strong style="color:#f6a332;">${escapeHtml(c.servicio)}</strong><br>
      Inversión: <strong>${escapeHtml(c.inversion)}</strong><br>
      ${paymentPolicyText(c.tipoPago)}
    `)}
    <p style="margin:16px 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
      El siguiente paso es firmar el acuerdo comercial para poder arrancar oficialmente:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td style="background-color:#f6a332;border-radius:6px;">
          <a href="${escapeHtml(c.contractLink)}" style="display:inline-block;padding:14px 28px;color:#111111;font-weight:700;text-decoration:none;font-size:14px;">FIRMAR CONTRATO</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 32px 0;font-size:15px;line-height:1.6;color:#333333;">
      En cuanto firmes y confirmemos el anticipo, te enviaremos el checklist de onboarding para arrancar dentro de las siguientes 48 horas.
    </p>
    <p style="margin:0 0 4px 0;font-size:15px;color:#333333;">Saludos,</p>
    <p style="margin:0;font-size:15px;font-weight:700;color:#111111;">El equipo de Moswen Designs</p>
  `;
  return wrapEmailBody(inner);
}

sendFromEnv({
  subject: `¡Bienvenido a Moswen Designs, ${CLIENTE.nombre}! — Siguiente paso: tu contrato`,
  html: buildHtml(CLIENTE),
});
