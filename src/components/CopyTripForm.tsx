import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTripApi } from '@/hooks/useTripApi'

type CopyTripFormProps = {
  onClose: () => void
}

export const CopyTripForm: FC<CopyTripFormProps> = ({ onClose }) => {
  const { currentUser, dbUserData, selectedTrip, tripApiLoading } =
    useAuthContext()
  const { copyTrip } = useTripApi()
  const { showToast } = useToast()

  const CopyTripFunc = async () => {
    if (currentUser && dbUserData && selectedTrip) {
      const idToken = await currentUser.getIdToken()
      const success = await copyTrip(idToken, currentUser.uid, selectedTrip)

      if (success) {
        onClose()
      }
    } else {
      showToast('error', 'ログインしてください。')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    CopyTripFunc()
  }

  const isFormValid =
    Boolean(currentUser) && Boolean(dbUserData) && Boolean(selectedTrip)

  return (
    <>
      {selectedTrip && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            {`「${selectedTrip.title}」をコピーします。コピーした旅行プランは非公開で保存されます。`}
          </p>
          <form onSubmit={handleSubmit}>
            <FormButton
              label="コピー"
              isFormValid={isFormValid}
              loading={tripApiLoading}
            />
          </form>
        </div>
      )}
    </>
  )
}
