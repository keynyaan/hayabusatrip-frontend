import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTripApi } from '@/hooks/useTripApi'
import { NOT_LOGIN_ERROR_MSG } from '@/utils/constants'

type DeleteTripFormProps = {
  onClose: () => void
}

export const DeleteTripForm: FC<DeleteTripFormProps> = ({ onClose }) => {
  const { currentUser, dbUserData, selectedTrip, tripApiLoading } =
    useAuthContext()
  const { deleteTrip } = useTripApi()
  const { showToast } = useToast()

  const DeleteTripFunc = async () => {
    if (currentUser && dbUserData && selectedTrip) {
      const idToken = await currentUser.getIdToken()
      const success = await deleteTrip(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token
      )

      if (success) {
        onClose()
      }
    } else {
      showToast('error', NOT_LOGIN_ERROR_MSG)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    DeleteTripFunc()
  }

  const isFormValid =
    Boolean(currentUser) && Boolean(dbUserData) && Boolean(selectedTrip)

  return (
    <>
      {selectedTrip && (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            {`「${selectedTrip.title}」を削除します。削除した旅行プランはアクセスできなくなります。`}
          </p>
          <form onSubmit={handleSubmit}>
            <FormButton
              label="削除"
              isFormValid={isFormValid}
              loading={tripApiLoading}
            />
          </form>
        </div>
      )}
    </>
  )
}
