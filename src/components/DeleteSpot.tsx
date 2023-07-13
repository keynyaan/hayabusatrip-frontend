import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useSpotApi } from '@/hooks/useSpotApi'
import { NOT_LOGIN_ERROR_MSG } from '@/utils/constants'

type DeleteSpotFormProps = {
  onClose: () => void
}

export const DeleteSpotForm: FC<DeleteSpotFormProps> = ({ onClose }) => {
  const {
    currentUser,
    dbUserData,
    selectedTrip,
    selectedSpot,
    spotApiLoading,
  } = useAuthContext()
  const { deleteSpot } = useSpotApi()
  const { showToast } = useToast()

  const DeleteSpotFunc = async () => {
    if (currentUser && dbUserData && selectedTrip && selectedSpot) {
      const idToken = await currentUser.getIdToken()
      const success = await deleteSpot(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        selectedSpot.id
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
    DeleteSpotFunc()
  }

  const isFormValid =
    Boolean(currentUser) &&
    Boolean(dbUserData) &&
    Boolean(selectedTrip) &&
    Boolean(selectedSpot)

  return (
    <>
      {selectedSpot && (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-700 mb-4">{`「${selectedSpot.title}」を削除します。`}</p>
          <form onSubmit={handleSubmit}>
            <FormButton
              label="削除"
              isFormValid={isFormValid}
              loading={spotApiLoading}
            />
          </form>
        </div>
      )}
    </>
  )
}
