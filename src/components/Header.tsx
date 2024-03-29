import { Logo } from '@/components/Logo'
import { AuthButtons } from '@/components/AuthButtons'
import { UserActionButtons } from '@/components/UserActionButtons'
import { useAuthContext } from '@/context/AuthContext'

export const Header: React.FC = () => {
  const { authLoading, currentUser, dbTripsData } = useAuthContext()

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-10 shadow h-16 px-4 flex justify-between items-center">
      <Logo />
      {currentUser && !authLoading && dbTripsData && <UserActionButtons />}
      {currentUser === null && <AuthButtons />}
    </header>
  )
}
