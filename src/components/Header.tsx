import { Logo } from '@/components/Logo'
import { AuthButtons } from '@/components/AuthButtons'
import { UserIcon } from '@/components/UserIcon'
import { useAuthContext } from '@/context/AuthContext'

export const Header: React.FC = () => {
  const { loading, currentUser, redirectResultFetched } = useAuthContext()

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-100 z-10 shadow h-24 p-4 flex justify-between items-center">
      <Logo />
      {currentUser && !loading && <UserIcon />}
      {!currentUser && !redirectResultFetched && <AuthButtons />}
    </header>
  )
}
