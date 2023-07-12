import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTripApi } from '@/hooks/useTripApi'
import { NOT_LOGIN_ERROR_MSG } from '@/utils/constants'
import { formatDate } from '@/utils/getDate'

type DeleteTripDateFormProps = {
  onClose: () => void
  date: string
}

export const DeleteTripDateForm: FC<DeleteTripDateFormProps> = ({
  onClose,
  date,
}) => {
  const { currentUser, dbUserData, selectedTrip, tripApiLoading } =
    useAuthContext()
  const { deleteTripDate } = useTripApi()
  const { showToast } = useToast()

  const DeleteTripDateFunc = async () => {
    if (currentUser && dbUserData && selectedTrip) {
      const idToken = await currentUser.getIdToken()

      const success = await deleteTripDate(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        date
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
    DeleteTripDateFunc()
  }

  const isFormValid =
    Boolean(currentUser) && Boolean(dbUserData) && Boolean(selectedTrip)

  return (
    <>
      {selectedTrip && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            「{formatDate(date)}
            」の日程を削除します。同じ日程の旅行スポットも全て削除されます。
            <br />
            また、3日以上ある日程の中日を削除した場合、削除日以降の日程が前倒しされます。
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
