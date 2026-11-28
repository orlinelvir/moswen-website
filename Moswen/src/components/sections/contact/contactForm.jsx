'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RiArrowRightUpLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'
import { formOptions } from '@/utlits/fackData/siteData'
import { readAttribution } from '@/utlits/attribution'

const Select = ({ id, name, label, options }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <select id={id} name={name} className="form-control" required defaultValue="">
            <option value="" disabled>Selecciona una opción</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
)

const ContactForm = () => {
    const router = useRouter()
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSending(true)
        const form = e.currentTarget
        const data = Object.fromEntries(new FormData(form).entries())
        data.consentimiento = form.consentimiento.checked ? "si" : ""
        const attr = readAttribution()
        data.fuente = window.location.pathname || "/"
        if (attr.ref) data.referido = attr.ref
        ;["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].forEach((k) => { if (attr[k]) data[k] = attr[k] })
        if (attr.landing) data.landing = attr.landing
        if (attr.referrer) data.referrer = attr.referrer
        try {
            const res = await fetch("/api/crm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
            if (!res.ok) {
                const d = await res.json().catch(() => ({}))
                throw new Error(d.error || "Error en el servidor")
            }
            try {
                sessionStorage.setItem("moswen_lead", JSON.stringify({ nombre: data.nombre, email: data.email, telefono: data.telefono, interes: data.interes }))
            } catch (err) {}
            router.push("/gracias")
        } catch (err) {
            setError("No pudimos enviar tu solicitud. Revisa tus datos o escríbenos a info@moswen.app o por WhatsApp.")
            setSending(false)
        }
    }

    return (
        <div className="col-lg-8">
            <SlideUp>
                <div className="contact-form contact-form-area">
                    <form className="contactForm" onSubmit={onSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input type="text" id="nombre" name="nombre" className="form-control" placeholder="Tu nombre" autoComplete="name" required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="email">Correo</label>
                                    <input type="email" id="email" name="email" className="form-control" placeholder="tu@correo.com" autoComplete="email" required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="telefono">WhatsApp</label>
                                    <input type="tel" id="telefono" name="telefono" className="form-control" placeholder="Número con código de país" autoComplete="tel" required />
                                </div>
                            </div>
                            <div className="col-md-6"><Select id="pais" name="pais" label="País" options={formOptions.paises} /></div>
                            <div className="col-md-6"><Select id="interes" name="interes" label="Servicio" options={formOptions.servicios} /></div>
                            <div className="col-md-6"><Select id="presupuesto" name="presupuesto" label="Presupuesto estimado (USD)" options={formOptions.presupuestos} /></div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="detalles">Cuéntanos de tu proyecto</label>
                                    <textarea name="detalles" id="detalles" className="form-control" rows="4" maxLength={1000} placeholder="Tu negocio y lo que necesitas"></textarea>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label className="moswen-consent" htmlFor="consentimiento">
                                    <input type="checkbox" id="consentimiento" name="consentimiento" required />
                                    <span>Acepto que Moswen me contacte por correo y WhatsApp sobre mi solicitud, y la <a href="/privacidad">política de privacidad</a>.</span>
                                </label>
                                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="moswen-honeypot" />
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mb-0">
                                    {error && <p role="alert" className="moswen-error">{error}</p>}
                                    <button type="submit" className="theme-btn" disabled={sending}>
                                        {sending ? "Enviando..." : <>Aplicar a una consulta <i><RiArrowRightUpLine size={15} /></i></>}
                                    </button>
                                    <p className="small mt-3 mb-0">Te respondemos el mismo día hábil.</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </SlideUp>
        </div>
    )
}

export default ContactForm
