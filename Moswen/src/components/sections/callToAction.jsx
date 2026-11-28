import React from 'react'
import Link from 'next/link'
import { RiArrowRightUpLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'

const CallToAction = () => {
    return (
        <section className="call-to-action-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <SlideUp>
                            <div className="about-content-part call-to-action-part text-center">
                                <h2>¿Listo para que tu marca, tu web y tus anuncios trabajen juntos?</h2>
                                <p>Cuéntanos de tu negocio y agenda una consulta de 30 minutos. Te respondemos el mismo día hábil.</p>
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

export default CallToAction
