'use client'
import { useEffect } from 'react'
import { captureAttribution } from '@/utlits/attribution'

// Guarda UTM, click ids y código de referido (30 días) para enviarlos con el formulario.
const Attribution = () => {
    useEffect(() => { captureAttribution() }, [])
    return null
}

export default Attribution
