import React from 'react'
import Link from 'next/link'
import { RiInstagramLine, RiFacebookCircleFill, RiCircleFill, RiArrowRightUpLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'
import { site } from '@/utlits/fackData/siteData'

const Hero = () => {
    return (
        <section id="about" className="about-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <SlideUp>
                            <div className="about-image-part moswen-brand-card">
                                <img src="/images/logo.svg" alt="Moswen Designs" style={{ height: 120, width: "auto" }} />
                                <h2>Moswen Designs</h2>
                                <p>Estudio de marca, sitios web y anuncios con base en Honduras.</p>
                                <div className="about-social text-center">
                                    <ul>
                                        <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><RiInstagramLine size={20} /></a></li>
                                        <li><a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><RiFacebookCircleFill size={20} /></a></li>
                                    </ul>
                                </div>
                            </div>
                        </SlideUp>
                    </div>
                    <div className="col-lg-8">
                        <SlideUp>
                            <div className="about-content-part">
                                <p>Honduras · EE.UU.</p>
                                <h1>
                                    Marca, web y anuncios para negocios que quieren crecer en serio.
                                </h1>
                                <p>Branding, landing pages, sitios premium, anuncios en Meta y agentes de IA para negocios latinos.</p>
                                <div className="adress-field">
                                    <ul>
                                        <li className='d-flex align-items-center'><i><RiCircleFill size={14} /></i> Recibimos nuevos proyectos</li>
                                    </ul>
                                </div>
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

export default Hero
