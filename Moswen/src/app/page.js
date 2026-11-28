import React from 'react'
import Hero from '@/components/sections/hero'
import ServiceGrid from '@/components/sections/serviceGrid'
import Portfolio from '@/components/sections/portfolio'

export const metadata = { alternates: { canonical: "/" } }

const Home = () => (
    <>
        <Hero />
        <ServiceGrid className="" />
        <Portfolio limit={6} />
    </>
)

export default Home
