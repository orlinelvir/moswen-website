/**
 * PLANTILLA 2: Checklist de Onboarding (48 hrs)
 * Cuándo usarla: justo después de que el cliente firma el contrato y paga el anticipo.
 * Evita ir pidiendo accesos/activos uno por uno vía WhatsApp.
 *
 * Cómo usarla:
 *   1. Edita CLIENTE.nombre y CLIENTE.servicio (usa una de las claves de CHECKLISTS de abajo).
 *   2. Define las variables de entorno (ver plantilla 1) y corre: node 2-checklist-onboarding.js
 */

const { escapeHtml, wrapEmailBody, calloutBox, sendFromEnv } = require('./_shared');

// ── Edita estos datos para cada cliente ──────────────────────────────────
const CLIENTE = {
  nombre: 'Nombre del Cliente',
  servicio: 'web',   // una de: 'web' | 'branding' | 'ads' | 'crm' | 'consultoria'
};
// ──────────────────────────────────────────────────────────────────────────

const CHECKLISTS = {
  web: [
    'Acceso al dominio (o indicarnos si necesitas que te ayudemos a comprarlo)',
    'Logo en alta resolución (SVG o PNG con fondo transparente)',
    'Textos/contenido de cada sección (o autorización para que los redactemos nosotros)',
    'Fotos o imágenes que quieras usar (o autorización para usar banco de imágenes)',
    '2-3 sitios web de referencia que te gusten (estilo visual)',
  ],
  branding: [
    'Nombre oficial de la marca y giro del negocio',
    'Misión, valores o cualquier documento de marca existente',
    '2-3 referencias visuales (colores, estilos, competencia que te guste)',
    'Listado de aplicaciones necesarias (papelería, redes, empaques, etc. según tu plan)',
  ],
  ads: [
    'Acceso de administrador a tu Meta Business Manager (o creamos uno juntos)',
    'Presupuesto mensual de pauta ya definido (recuerda: lo pagas tú directo a Meta)',
    'Descripción de tu cliente ideal (edad, ubicación, intereses)',
    'Fotos/videos de tu negocio o productos para los anuncios',
  ],
  crm: [
    'Acceso o exportación de tu base de contactos actual (Excel, WhatsApp Business, etc.)',
    'Descripción de tu proceso de ventas actual (cómo respondes hoy a un prospecto)',
    'Accesos a los canales que quieres automatizar (WhatsApp, correo, SMS)',
  ],
  consultoria: [
    'Información financiera básica del negocio (ingresos, costos aproximados)',
    'Objetivo del plan de negocio (préstamo, socio inversionista, licencia comercial)',
    'Cualquier documento/plan previo que ya tengas, aunque sea borrador',
  ],
};

const SERVICE_LABELS = {
  web: 'Desarrollo Web',
  branding: 'Identidad Visual y Branding',
  ads: 'Lead Generation & Publicidad Pagada',
  crm: 'CRM Setup & Automatización',
  consultoria: 'Consultoría de Negocios',
};

function buildHtml(c) {
  const items = CHECKLISTS[c.servicio] || CHECKLISTS.web;
  const listHtml = items.map(i => `<li style="margin-bottom:8px;">${escapeHtml(i)}</li>`).join('');

  const inner = `
    <h1 style="margin:0 0 16px 0;font-size:22px;color:#111111;">¡Empecemos, ${escapeHtml(c.nombre)}!</h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
      Para arrancar tu proyecto de <strong style="color:#f6a332;">${escapeHtml(SERVICE_LABELS[c.servicio] || c.servicio)}</strong> sin atrasos, necesitamos que nos compartas lo siguiente dentro de las próximas 48 horas:
    </p>
    ${calloutBox('Checklist de onboarding', `
      <ul style="margin:8px 0 0 0;padding-left:18px;">${listHtml}</ul>
    `)}
    <p style="margin:16px 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
      Puedes responder este correo directamente con la información, o compartirla por el canal que prefieras. En cuanto la tengamos completa, comenzamos con el desarrollo y configuración de tu proyecto.
    </p>
    <p style="margin:0 0 4px 0;font-size:15px;color:#333333;">Saludos,</p>
    <p style="margin:0;font-size:15px;font-weight:700;color:#111111;">El equipo de Moswen Designs</p>
  `;
  return wrapEmailBody(inner);
}

sendFromEnv({
  subject: `Checklist de onboarding — ${CLIENTE.nombre}`,
  html: buildHtml(CLIENTE),
});
