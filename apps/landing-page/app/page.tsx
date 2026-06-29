"use client";

import React from 'react'
import { LandingNavbar } from '@/app/components/landing/LandingNavbar'
import { LandingHero } from '@/app/components/landing/LandingHero'
import { LogoCloud } from '@/app/components/landing/LogoCloud'
import { LandingSetup } from '@/app/components/landing/LandingSetup'
import { LandingFeatures } from '@/app/components/landing/LandingFeatures'
import { LandingIntegrations } from '@/app/components/landing/LandingIntegrations'
import { Testimonials } from '@/app/components/landing/Testimonials'
import { LandingPricing } from '@/app/components/landing/LandingPricing'
import { LandingFooter } from '@/app/components/landing/LandingFooter'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-background selection:bg-primary/30 selection:text-white">
            <LandingNavbar />
            <LandingHero />
            <LogoCloud />
            <LandingSetup />
            <LandingFeatures />
            <LandingIntegrations />
            <Testimonials />
            <LandingPricing />
            <LandingFooter />
        </main>
    )
}
