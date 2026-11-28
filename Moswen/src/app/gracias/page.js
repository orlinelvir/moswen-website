import React from 'react'
import GraciasClient from './graciasClient'

export const metadata = {
  title: "Reserva tu consulta | Moswen Designs",
  robots: { index: false, follow: true },
}

const Gracias = () => (
    <section className="contact-area innerpage-single-area">
        <div className="container">
            <div className="container-inner">
                <div className="section-title text-center">
                    <p>Solicitud recibida</p>
                    <h1>Reserva tu consulta</h1>
                    <p>Elige el día y la hora que te convenga. Es una videollamada de 30 minutos para entender tu negocio y proponerte el siguiente paso. Si prefieres, también te respondemos el mismo día hábil.</p>
                </div>
                <GraciasClient />
                <div className="text-center mt-5">
                    <h4>Qué pasa después</h4>
                    <ol className="text-start mx-auto" style={{ maxWidth: 560 }}>
                        <li>Hablamos 30 minutos y revisamos tu negocio, tu objetivo y tu presupuesto.</li>
                        <li>Te enviamos una propuesta y un contrato con alcance, precio y tiempos.</li>
                        <li>Con tu aprobación y el anticipo del 50% iniciamos. El saldo se paga antes de entregar los archivos finales.</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
)

export default Gracias
