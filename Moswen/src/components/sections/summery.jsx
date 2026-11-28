import React from 'react'
import Link from 'next/link'
import { RiArrowRightUpLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'

const team = [
    { id: 1, name: "Samantha Chávez", role: "Dirección creativa y branding" },
    { id: 2, name: "Fernando Elvir", role: "Sitios web, anuncios y automatización" },
]

const Summery = () => {
    return (
        <section id="about" className="about-single-area innerpage-single-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <SlideUp>
                            <div className="about-image-part moswen-brand-card">
                                <img src="/images/logo.svg" alt="Moswen Designs" style={{ height: 120, width: "auto" }} />
                                {team.map(({ id, name, role }) => (
                                    <div key={id} className="mt-3">
                                        <h2 style={{ fontSize: 22 }}>{name}</h2>
                                        <p className="mb-0">{role}</p>
                                    </div>
                                ))}
                            </div>
                        </SlideUp>
                    </div>
                    <div className="col-lg-8">
                        <SlideUp>
                            <div className="about-content-part">
                                <h1>Somos Moswen Designs.</h1>
                                <p>Un estudio de marca, sitios web y anuncios con base en Honduras que trabaja con negocios latinos en EE.UU. y Honduras. Somos dos personas, con trato directo y trabajo hecho a tu medida.</p>
                                <p>Combinamos identidad visual, páginas que convierten, anuncios en Meta y agentes de IA conectados a tu CRM, para que tu marca, tu web y tus anuncios trabajen como un solo sistema.</p>
                                <div className="hero-btns">
                                    <Link href="/aplicar" className="theme-btn">Aplicar a una consulta <i><RiArrowRightUpLine size={16} /></i></Link>
                                </div>
                            </div>
                        </SlideUp>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Summery
