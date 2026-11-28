'use client'
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { site } from '@/utlits/fackData/siteData'

const GraciasClient = () => {
    const [src, setSrc] = useState(site.bookingUrl)

    useEffect(() => {
        let lead = null
        try { lead = JSON.parse(sessionStorage.getItem("moswen_lead") || "null") } catch (e) {}
        if (lead) {
            const q = []
            const parts = String(lead.nombre || "").trim().split(/\s+/)
            if (parts[0]) q.push("first_name=" + encodeURIComponent(parts[0]))
            if (parts.length > 1) q.push("last_name=" + encodeURIComponent(parts.slice(1).join(" ")))
            if (lead.email) q.push("email=" + encodeURIComponent(lead.email))
            if (lead.telefono) q.push("phone=" + encodeURIComponent(lead.telefono))
            if (q.length) setSrc(site.bookingUrl + "?" + q.join("&"))
            // Evento Lead solo justo después de enviar el formulario (no al recargar ni desde un correo)
            if (typeof window.fbq === "function") window.fbq("track", "Lead", { content_name: lead.interes || undefined })
            try { sessionStorage.removeItem("moswen_lead") } catch (e) {}
        }
    }, [])

    return (
        <>
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden" }}>
                <iframe id="moswen_booking" src={src} title="Agenda tu consulta con Moswen" style={{ width: "100%", minHeight: 700, border: "none", overflow: "hidden" }} scrolling="no" />
            </div>
            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
            <div className="text-center mt-4">
                <a className="theme-btn" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hola Moswen Designs, acabo de enviar mi solicitud en el sitio.")}`} target="_blank" rel="noopener noreferrer">O escríbenos por WhatsApp</a>
            </div>
        </>
    )
}

export default GraciasClient
