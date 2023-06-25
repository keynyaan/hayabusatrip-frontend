import React, { FC, useEffect } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { InputField } from '@/components//InputField'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useForm } from '@/hooks/useForm'
import { useTripApi } from '@/hooks/useTripApi'

type TripTitleFormProps = {
  onClose: () => void
}

export const TripTitleForm: FC<TripTitleFormProps> = ({ onClose }) => {
  const { currentUser, dbUserData, selectedTrip, setSelectedTrip } =
    useAuthContext()
  const { updateTrip } = useTripApi()
  const { showToast } = useToast()

  const updateTripFunc = async () => {
    if (currentUser && dbUserData && selectedTrip) {
      const idToken = await currentUser.getIdToken()
      const success = await updateTrip(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        {
          title: tripTitle,
        }
      )

      if (success) {
        onClose()
        setSelectedTrip(success)
      }
    } else {
      showToast('error', 'ログインしてください。')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateTripFunc()
  }

  const {
    tripTitle,
    tripTitleError,
    isTripTitleFormValid,
    handleTripTitleChange,
    handleTripTitleBlur,
  } = useForm()

  useEffect(() => {
    if (selectedTrip) {
      handleTripTitleChange({
        target: { value: selectedTrip.title },
      } as React.ChangeEvent<HTMLInputElement>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip])

  return (
    <>
      {selectedTrip && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">旅行タイトルを変更します。</p>
          <InputField
            id="trip-title"
            type="text"
            labelName="旅行タイトル"
            srOnly={true}
            maxLength={30}
            value={tripTitle}
            onChange={handleTripTitleChange}
            onBlur={handleTripTitleBlur}
            error={tripTitleError}
          />
          <form onSubmit={handleSubmit}>
            <FormButton
              label="変更"
              isFormValid={isTripTitleFormValid}
              isTripApi={true}
            />
          </form>
        </div>
      )}
    </>
  )
}