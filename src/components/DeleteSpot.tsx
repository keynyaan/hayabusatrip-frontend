import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useSpotApi } from '@/hooks/useSpotApi'

type DeleteSpotFormProps = {
  onClose: () => void
}

export const DeleteSpotForm: FC<DeleteSpotFormProps> = ({ onClose }) => {
  const { currentUser, dbUserData, selectedTrip, selectedSpot } =
    useAuthContext()
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
      showToast('error', 'ログインしてください。')
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
          <p className="text-gray-700 mb-4">{`「${selectedSpot.title}」を削除します。`}</p>
          <form onSubmit={handleSubmit}>
            <FormButton
              label="削除"
              isFormValid={isFormValid}
              isSpotApi={true}
            />
          </form>
        </div>
      )}
    </>
  )
}