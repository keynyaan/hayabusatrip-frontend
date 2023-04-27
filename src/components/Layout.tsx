import React from 'react'
import { Confetti } from '@/components/Confetti'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

type LayoutProps = {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="z-20">
        <Confetti />
      </div>
      <Header />
      <main className="pt-24 px-4 flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
