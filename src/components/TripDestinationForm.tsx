import React, { FC, useEffect } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { SelectField } from '@/components/SelectField'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useForm } from '@/hooks/useForm'
import { useTripApi } from '@/hooks/useTripApi'
import { TRIP_DESTINATION_ITEMS } from '@/utils/constants'

type TripDestinationFormProps = {
  onClose: () => void
}

export const TripDestinationForm: FC<TripDestinationFormProps> = ({
  onClose,
}) => {
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
          prefecture_id: parseInt(tripDestination),
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
    tripDestination,
    isTripDestinationFormValid,
    handleTripDestinationChange,
  } = useForm()

  useEffect(() => {
    if (selectedTrip) {
      handleTripDestinationChange({
        target: { value: String(selectedTrip.prefecture_id) },
      } as React.ChangeEvent<HTMLSelectElement>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip])

  return (
    <>
      {selectedTrip && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">旅行先を変更します。</p>
          <SelectField
            id="trip-destination"
            labelName="旅行先"
            srOnly={true}
            value={tripDestination}
            items={TRIP_DESTINATION_ITEMS}
            onChange={handleTripDestinationChange}
          />
          <form onSubmit={handleSubmit}>
            <FormButton
              label="変更"
              isFormValid={isTripDestinationFormValid}
              isTripApi={true}
            />
          </form>
        </div>
      )}
    </>
  )
}