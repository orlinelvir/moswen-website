import React from 'react'
import { RiPantoneFill, RiGlobalFill, RiMegaphoneLine, RiRobot2Line } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'
import { services } from '@/utlits/fackData/siteData'

const icons = {
    brand: <RiPantoneFill size={60} />,
    web: <RiGlobalFill size={60} />,
    ads: <RiMegaphoneLine size={60} />,
    ai: <RiRobot2Line size={60} />,
}

const ServiceGrid = ({ className = "innerpage-single-area" }) => {
    return (
        <section id="services" className={`services-area ${className}`}>
            <div className="container">
                <div className="container-inner">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12">
                            <SlideUp>
                                <div className="section-title text-center">
                                    <p>Servicios</p>
                                    <h2>Lo que hacemos por tu negocio</h2>
                                </div>
                            </SlideUp>
                        </div>
                    </div>
                    <div className="row">
                        {services.map(({ id, icon, title, description }) => (
                            <div className="col-lg-6 col-md-6" key={id}>
                                <SlideUp delay={id}>
                                    <div className="service-item">
                                        {icons[icon]}
                                        <h4>{title}</h4>
                                        <p>{description}</p>
                                    </div>
                                </SlideUp>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServiceGrid
