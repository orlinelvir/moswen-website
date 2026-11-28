import { RiMailLine, RiMapPinLine, RiWhatsappLine } from '@remixicon/react'
import React from 'react'
import SlideUp from '../../../utlits/animations/slideUp'
import { site } from '@/utlits/fackData/siteData'

const items = [
    { id: 1, icon: <RiMapPinLine size={20} />, title: "Dónde estamos:", text: "Honduras · EE.UU." },
    { id: 2, icon: <RiWhatsappLine size={20} />, title: "WhatsApp:", text: site.whatsappLabel, href: `https://wa.me/${site.whatsapp}` },
    { id: 3, icon: <RiMailLine size={20} />, title: "Correo:", text: site.email, href: `mailto:${site.email}` },
]

const ContactOption = () => {
    return (
        <div className="col-lg-4">
            <SlideUp>
                <div className="contact-content-part">
                    {items.map(({ id, icon, title, text, href }) => (
                        <SlideUp delay={id + 1} key={id}>
                            <div className="single-contact">
                                <div className="contact-icon"><i>{icon}</i></div>
                                <h2>{title}</h2>
                                <p>{href ? <a href={href} target="_blank" rel="noopener noreferrer">{text}</a> : text}</p>
                            </div>
                        </SlideUp>
                    ))}
                </div>
            </SlideUp>
        </div>
    )
}

export default ContactOption
