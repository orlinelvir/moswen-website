import Link from 'next/link'
import React from 'react'
import { site } from '@/utlits/fackData/siteData'

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer className="main-footer">
            <div className="footer-bottom pt-50 pb-40">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="copyright-text">
                                <p>© {year} <Link href="/">Moswen Designs</Link> · Honduras · EE.UU. · <Link href="/privacidad">Política de privacidad</Link></p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="copyright-text extra-copyright">
                                <p>
                                    <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a> · <a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a> · <a href={`mailto:${site.email}`}>{site.email}</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
