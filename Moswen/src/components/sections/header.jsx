'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiShakeHandsLine } from '@remixicon/react'
import { menuList } from '@/utlits/fackData/siteData'

const Header = () => {
    const pathName = usePathname()
    const [isSticky, setisSticky] = useState(false)

    useEffect(() => {
        const navbar_collapse = document.querySelector(".navbar-collapse")
        if (navbar_collapse) navbar_collapse.classList.remove("show")
    }, [pathName])

    useEffect(() => {
        const stickyHeader = () => setisSticky(window.scrollY > 85)
        window.addEventListener("scroll", stickyHeader)
        return () => window.removeEventListener("scroll", stickyHeader)
    }, [])

    return (
        <header className={`main-header ${isSticky ? "fixed-header" : ""}`}>
            <div className="header-upper">
                <div className="container">
                    <div className="header-inner d-flex align-items-center">
                        <div className="logo-outer">
                            <div className="logo">
                                <Link href="/">
                                    <img src="/images/logo.svg" alt="Moswen Designs" style={{ height: 40, width: "auto" }} />
                                </Link>
                            </div>
                        </div>
                        <div className="nav-outer clearfix mx-auto">
                            <nav className="main-menu navbar-expand-lg">
                                <div className="navbar-header">
                                    <div className="mobile-logo">
                                        <Link href="/">
                                            <img src="/images/logo.svg" alt="Moswen Designs" style={{ height: 28, width: "auto" }} />
                                        </Link>
                                    </div>
                                    <button type="button" className="navbar-toggle" aria-label="Abrir menú" data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>
                                </div>
                                <div className="navbar-collapse collapse">
                                    <ul className="navigation onepage clearfix">
                                        {menuList.map(({ id, label, path }) => <li key={id}><Link href={path} className="nav-link-click">{label}</Link></li>)}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <div className="menu-btns">
                            <Link href="/aplicar" className="theme-btn">Aplicar a una consulta <RiShakeHandsLine size={15} /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
