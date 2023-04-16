import { Logo } from '@/components/Logo'
import { AuthButtons } from '@/components/AuthButtons'

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-100 z-10 shadow h-24 p-4 flex justify-between items-center">
      <Logo />
      <AuthButtons />
    </header>
  )
}
