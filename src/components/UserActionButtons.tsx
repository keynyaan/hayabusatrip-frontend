import { CreateTripButton } from '@/components/CreateTripButton'
import { UserIcon } from '@/components/UserIcon'

export const UserActionButtons: React.FC = () => {
  return (
    <div className="flex space-x-4 items-center">
      <CreateTripButton />
      <UserIcon />
    </div>
  )
}
