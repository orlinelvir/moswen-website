/**
 * PLANTILLA 3: Entrega Final
 * Cuándo usarla: al completar y lanzar el proyecto (paso "Lanzamiento & Optimización").
 *
 * Cómo usarla:
 *   1. Edita el objeto CLIENTE abajo.
 *   2. Define las variables de entorno (ver plantilla 1) y corre: node 3-entrega-final.js
 */

const { escapeHtml, wrapEmailBody, calloutBox, sendFromEnv } = require('./_shared');

// ── Edita estos datos para cada cliente ──────────────────────────────────
const CLIENTE = {
  nombre: 'Nombre del Cliente',
  servicio: 'Website Corporativo',
  entregables: [
    'Sitio web publicado y funcionando en tu dominio',
    'Acceso de administrador al panel/hosting',
    'Formulario de contacto conectado y probado',
  ],
  esRetainer: false,   // true si es un servicio de Ads/Social Media que sigue mes a mes
  incluyeMantenimiento: true, // true si aplica el mantenimiento mensual de $50 USD
};
// ──────────────────────────────────────────────────────────────────────────

function buildHtml(c) {
  const entregablesHtml = c.entregables.map(e => `<li style="margin-bottom:8px;">${escapeHtml(e)}</li>`).join('');

  const nextSteps = c.esRetainer
    ? 'A partir de ahora entramos en fase de optimización continua — recibirás tu reporte de resultados cada mes.'
    : c.incluyeMantenimiento
      ? 'Recuerda que cuentas con nuestro plan de mantenimiento mensual ($50 USD) para cambios de contenido, respaldo y soporte prioritario — avísanos si quieres activarlo.'
      : 'Si más adelante necesitas ajustes, actualizaciones o un nuevo proyecto, aquí estaremos.';

  const inner = `
    <h1 style="margin:0 0 16px 0;font-size:22px;color:#111111;">¡Tu proyecto está listo, ${escapeHtml(c.nombre)}!</h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
      Con esto damos por entregado tu proyecto de <strong style="color:#f6a332;">${escapeHtml(c.servicio)}</strong>. Gracias por la confianza durante todo el proceso.
    </p>
    ${calloutBox('Qué te estamos entregando', `
      <ul style="margin:8px 0 0 0;padding-left:18px;">${entregablesHtml}</ul>
    `)}
    <p style="margin:16px 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
      ${nextSteps}
    </p>
    <p style="margin:0 0 32px 0;font-size:15px;line-height:1.6;color:#333333;">
      Si te gustó el resultado, nos encantaría contar con tu opinión — cualquier feedback o testimonio nos ayuda muchísimo a seguir creciendo.
    </p>
    <p style="margin:0 0 4px 0;font-size:15px;color:#333333;">Saludos,</p>
    <p style="margin:0;font-size:15px;font-weight:700;color:#111111;">El equipo de Moswen Designs</p>
  `;
  return wrapEmailBody(inner);
}

sendFromEnv({
  subject: `¡Tu proyecto con Moswen Designs está listo, ${CLIENTE.nombre}!`,
  html: buildHtml(CLIENTE),
});
