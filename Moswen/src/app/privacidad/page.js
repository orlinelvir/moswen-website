import React from 'react'

export const metadata = {
  title: "Política de privacidad | Moswen Designs",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacidad" },
}

const Privacy = () => (
    <section className="innerpage-single-area">
        <div className="container">
            <div className="container-inner" style={{ maxWidth: 820, margin: "0 auto" }}>
                <div className="section-title">
                    <p>Documento legal</p>
                    <h1>Política de privacidad</h1>
                    <p>Última actualización: noviembre de 2026</p>
                </div>
                <p>En <strong>Moswen Designs</strong> respetamos tu privacidad. Esta política explica qué información recopilamos cuando interactúas con nosotros —a través de nuestro sitio web, formularios, anuncios en Meta (Facebook/Instagram) o mensajes directos— y cómo la usamos.</p>
                <h4 className="mt-4">1. Información que recopilamos</h4>
                <p>Cuando llenas un formulario, nos escribes por Instagram, Facebook o WhatsApp, o interactúas con nuestros anuncios, podemos recopilar: nombre, correo electrónico, número de teléfono o WhatsApp, país, y los detalles que nos compartas sobre tu proyecto o negocio (servicio de interés, presupuesto estimado, etc.).</p>
                <h4 className="mt-4">2. Cómo usamos tu información</h4>
                <ul>
                    <li>Para responder tu consulta y darte seguimiento comercial.</li>
                    <li>Para enviarte información sobre nuestros servicios cuando lo solicites.</li>
                    <li>Para agendar consultas, enviarte propuestas y contratos, y procesar pagos de los servicios que contrates.</li>
                    <li>Para mejorar la relevancia de nuestros anuncios en Meta y medir qué campañas funcionan.</li>
                </ul>
                <p>No vendemos ni compartimos tu información con terceros para fines distintos a los aquí descritos.</p>
                <h4 className="mt-4">3. Servicios de terceros que utilizamos</h4>
                <ul>
                    <li><strong>Meta (Facebook/Instagram) y Meta Pixel</strong> — cuando interactúas con nuestros anuncios o nos escribes por esos canales; el Pixel usa cookies para medir visitas y acciones.</li>
                    <li><strong>Resend</strong> — envío de correos de confirmación y notificaciones.</li>
                    <li><strong>Go High Level</strong> — nuestro CRM: guarda tu solicitud, agenda las consultas y envía mensajes de seguimiento por correo y WhatsApp.</li>
                    <li><strong>PayPal</strong> — procesa los pagos de los servicios contratados. No guardamos datos de tarjeta.</li>
                    <li><strong>Vercel</strong> — aloja este sitio web.</li>
                </ul>
                <h4 className="mt-4">4. Cuánto tiempo conservamos tu información</h4>
                <p>Conservamos los datos de tu solicitud mientras sea necesario para atenderte y por un máximo de 24 meses desde el último contacto, salvo que seas cliente: en ese caso, por el tiempo que exijan nuestras obligaciones contractuales y fiscales.</p>
                <h4 className="mt-4">5. Tus derechos</h4>
                <p>Puedes solicitarnos en cualquier momento que actualicemos o eliminemos tu información de contacto, o que dejemos de escribirte, escribiéndonos a <a href="mailto:info@moswen.app">info@moswen.app</a>.</p>
                <h4 className="mt-4">6. Contacto</h4>
                <p>Si tienes preguntas sobre esta política, contáctanos en <a href="mailto:info@moswen.app">info@moswen.app</a> o al +504 9315-7191.</p>
            </div>
        </div>
    </section>
)

export default Privacy
