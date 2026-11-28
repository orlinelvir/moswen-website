# Moswen Designs - sitio web (Next.js)

Base: plantilla Bentos de Envato (Next.js 14). La web estatica anterior esta en `../web-anterior/`
y en la etiqueta de git `web-anterior-2026-11-27`.

- Contenido, precios y proyectos: `src/utlits/fackData/siteData.js`
- Formulario: `src/components/sections/contact/contactForm.jsx` -> `src/app/api/crm/route.js`
- Variables de entorno: ver `.env.example` (GHL_WEBHOOK_URL y Resend)

```
npm install
npm run dev     # http://localhost:3000
npm run build
```

Nota: no ejecutar `npm install` dentro de Google Drive (rompe la sincronizacion). Trabajar desde el clon en D:.
