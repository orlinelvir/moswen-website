# Plantillas de correo — Moswen Designs

Scripts locales (Node 18+) para enviar los correos de cada etapa del proceso con cliente. No se despliegan al sitio — se corren manualmente desde tu PC cuando un cliente llega a esa etapa.

## Uso general

1. Define las 3 variables de entorno una vez por sesión de terminal:
   ```powershell
   $env:RESEND_API_KEY="re_xxxxxxxx"
   $env:RESEND_FROM_EMAIL="Moswen Designs <info@moswendesigns.com>"
   $env:CLIENT_EMAIL="correo-del-cliente@ejemplo.com"
   ```
2. Abre la plantilla que necesites y edita el objeto `CLIENTE` de arriba con los datos de ese cliente.
3. Corre `node <archivo>.js`.

## Plantillas disponibles

| Archivo | Cuándo enviarla |
|---|---|
| `1-bienvenida-contrato.js` | Cliente acepta la propuesta — incluye resumen del servicio, monto y link al contrato. |
| `2-checklist-onboarding.js` | Justo después de firmar y pagar el anticipo — pide accesos/activos según el tipo de servicio (`web`, `branding`, `ads`, `crm`, `consultoria`). |
| `3-entrega-final.js` | Al completar y lanzar el proyecto — resume entregables y próximos pasos (mantenimiento o reportes mensuales). |

## Pendientes (avisar cuando se necesiten)

- **Reporte mensual** (Ads / Social Media Management) — antes de que entre el primer cliente de retainer.
- **Recordatorio de pago mensual** — para retainers con cobro 100% adelantado.
- **Solicitud de testimonio** — 30-60 días después de una entrega exitosa.

`_shared.js` tiene el logo, redes sociales y footer comunes — si cambian esos datos, se actualizan ahí una sola vez y aplica a todas las plantillas.
