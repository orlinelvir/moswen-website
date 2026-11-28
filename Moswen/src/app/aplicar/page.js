import React from 'react'
import ContactOption from '@/components/sections/contact/contactOption'
import ContactForm from '@/components/sections/contact/contactForm'

export const metadata = {
  title: "Aplicar a una consulta | Moswen Designs",
  description: "Cuéntanos de tu negocio y agenda una consulta de 30 minutos con Moswen Designs.",
  alternates: { canonical: "/aplicar" },
}

const Apply = () => (
    <section id="contact" className="contact-area innerpage-single-area">
        <div className="container">
            <div className="container-inner">
                <div className="row">
                    <div className="col-xl-12 col-lg-12">
                        <div className="section-title text-center">
                            <p>Aplicar</p>
                            <h1>Aplica a una consulta</h1>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <ContactOption />
                    <ContactForm />
                </div>
            </div>
        </div>
    </section>
)

export default Apply
