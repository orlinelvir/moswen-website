import React from 'react'
import Link from 'next/link'
import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'
import { plans } from '@/utlits/fackData/siteData'

const Pricing = () => {
    return (
        <section className="pricing-area">
            <div className="container">
                <div className="container-inner">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12">
                            <SlideUp>
                                <div className="section-title text-center">
                                    <p>Planes y precios</p>
                                    <h2>Paquetes de entrada</h2>
                                </div>
                            </SlideUp>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {plans.map(({ id, title, price, sortInfo, features }) => (
                            <div className="col-lg-4 col-md-6" key={id}>
                                <SlideUp delay={id}>
                                    <div className="pricing-item">
                                        <div className="pricing-header">
                                            <h4 className="title">{title}</h4>
                                            <p className="save-percent">{sortInfo}</p>
                                            <span className="price">{price}</span>
                                        </div>
                                        <div className="pricing-details">
                                            <ul>
                                                {features.map(({ id, feature }) => <li key={id}><i><RiArrowRightLine size={14} /></i>{feature}</li>)}
                                            </ul>
                                            <Link href="/aplicar" className="theme-btn">Aplicar a una consulta <i><RiArrowRightUpLine size={16} /></i></Link>
                                        </div>
                                    </div>
                                </SlideUp>
                            </div>
                        ))}
                    </div>
                    <SlideUp>
                        <p className="text-center mt-4">
                            También: <strong>Anuncios en Meta desde $750/mes</strong> (la inversión en anuncios la paga el cliente) y <strong>agente virtual con IA desde $1,500 + mensualidad</strong>.
                            Pagamos 50% para iniciar y 50% antes de entregar los archivos finales. El dominio lo compra directamente el cliente.
                        </p>
                    </SlideUp>
                </div>
            </div>
        </section>
    )
}

export default Pricing
