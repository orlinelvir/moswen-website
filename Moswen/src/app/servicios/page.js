import React from 'react'
import ServiceGrid from '@/components/sections/serviceGrid'
import Pricing from '@/components/sections/pricing'

export const metadata = {
  title: "Servicios y precios | Moswen Designs",
  description: "Marca e identidad, sitios web y landing pages, anuncios en Meta y agentes de IA. Paquetes desde $450.",
  alternates: { canonical: "/servicios" },
}

const Service = () => (
    <>
        <ServiceGrid />
        <Pricing />
    </>
)

export default Service
