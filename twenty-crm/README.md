# Twenty CRM — self-host para Moswen Designs

[Twenty](https://twenty.com) es un CRM open-source (código gratis para siempre). Lo que **sí cuesta dinero** es el servidor donde lo alojas — Twenty necesita un contenedor corriendo 24/7 con Postgres + Redis, no es un sitio estático como moswendesigns.com.

## Costo real (con pocos recursos)

Estas dos opciones son las más baratas para arrancar:

| Opción | Costo aprox. | Notas |
|---|---|---|
| **Hetzner Cloud CX22** (Recomendado) | ~$4.50 USD/mes | 2 vCPU, 4GB RAM — alcanza cómodo para Twenty + Postgres + Redis para un equipo de 2-5 personas. |
| **DigitalOcean Droplet Basic** | ~$6 USD/mes | 1 vCPU, 2GB RAM — funciona pero más justo de memoria. |

Evita intentar correrlo en un free-tier tipo Railway/Render gratis: Twenty + Postgres + Redis + worker son 4 procesos corriendo a la vez, y los free tiers normalmente duermen el servicio o no alcanzan de RAM.

## Pasos para levantarlo

1. Crea el servidor (Hetzner o DigitalOcean) con Ubuntu 22.04+ y Docker instalado (ambos providers tienen una imagen "Docker" lista para usar, evitas instalarlo a mano).
2. Copia esta carpeta (`docker-compose.yml` y `.env.example`) al servidor.
3. Renombra `.env.example` a `.env` y edita:
   - `PG_DATABASE_PASSWORD` — pon una contraseña fuerte.
   - `SERVER_URL` — la URL donde vas a acceder (ej. `http://IP_DEL_SERVIDOR:3000` para probar, o tu dominio real después).
   - `ENCRYPTION_KEY` — genera uno con `openssl rand -base64 32` y pégalo.
4. Levanta todo:
   ```bash
   docker compose up -d
   ```
5. Espera ~1 minuto (la primera vez corre migraciones de base de datos) y entra a `http://IP_DEL_SERVIDOR:3000` — ahí creas tu cuenta de administrador.

## Después de tenerlo corriendo

- **Dominio propio**: apunta un subdominio (ej. `crm.moswendesigns.com`) al servidor y pon un proxy con HTTPS (Caddy es el más simple — 3 líneas de config y certificado automático). Avísame cuando llegues aquí y te preparo el Caddyfile.
- **Conectar los leads del sitio**: Twenty tiene API/webhooks — una vez esté en línea, puedo modificar `api/crm.js` para que además de mandar el correo por Resend, cree el contacto/oportunidad directo en Twenty.
- **Backups**: el volumen `db-data` es donde vive toda tu información — configura un respaldo automático de ese volumen (snapshot del proveedor, o un cron con `pg_dump`) antes de meter clientes reales.
