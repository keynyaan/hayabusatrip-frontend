import React from 'react'
import { Confetti } from '@/components/Confetti'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuthContext } from '@/context/AuthContext'

type LayoutProps = {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { firstLogin } = useAuthContext()

  return (
    <div className="flex flex-col min-h-screen relative">
      {firstLogin && (
        <div className="z-20">
          <Confetti />
        </div>
      )}
      <Header />
      <main className="pt-24 flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
