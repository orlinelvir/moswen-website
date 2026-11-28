import React from 'react'
import SlideUp from '@/utlits/animations/slideUp'
import { projects } from '@/utlits/fackData/siteData'

const Portfolio = ({ className = "", limit }) => {
    const list = limit ? projects.slice(0, limit) : projects
    return (
        <section id="portfolio" className={`projects-area ${className}`}>
            <div className="container">
                <div className="container-inner">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12">
                            <SlideUp>
                                <div className="section-title text-center">
                                    <h2>Trabajo reciente</h2>
                                    <p>Identidades de marca que hemos creado para negocios reales.</p>
                                </div>
                            </SlideUp>
                        </div>
                    </div>
                    <div className="row">
                        {list.map(({ id, src, category, title, line }) => (
                            <div className="col-lg-4 col-md-6" key={id}>
                                <SlideUp delay={id}>
                                    <div className="project-item style-two">
                                        <div className="project-image">
                                            {src
                                                ? <img src={src} alt={`${title}: ${line}`} style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "contain", background: "#0b0b0b" }} />
                                                : <div className="project-placeholder">Imagen pendiente de selección</div>}
                                        </div>
                                        <div className="project-content">
                                            <span className="sub-title">{category}</span>
                                            <h3>{title}</h3>
                                            <p className="small mb-0">{line}</p>
                                        </div>
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

export default Portfolio
