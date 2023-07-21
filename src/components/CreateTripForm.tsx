import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { InputField } from '@/components/InputField'
import { FormButton } from '@/components/FormButton'
import { SelectField } from '@/components/SelectField'
import { useForm } from '@/hooks/useForm'
import { useTripApi } from '@/hooks/useTripApi'
import {
  MAX_DATE,
  MAX_TRIP_TITLE_LENGTH,
  MIN_DATE,
  NOT_LOGIN_ERROR_MSG,
  TRIP_DESTINATION_ITEMS,
} from '@/utils/constants'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

type CreateTripFormProps = {
  onClose: () => void
}

export const CreateTripForm: FC<CreateTripFormProps> = ({ onClose }) => {
  const { currentUser, dbUserData, tripApiLoading } = useAuthContext()
  const { createTrip } = useTripApi()
  const { showToast } = useToast()

  const createTripFunc = async () => {
    if (currentUser && dbUserData) {
      const idToken = await currentUser.getIdToken()
      const success = await createTrip(idToken, currentUser.uid, {
        user_id: dbUserData.id,
        prefecture_id: parseInt(tripDestination),
        title: tripTitle,
        start_date: startDate,
        end_date: endDate,
      })

      if (success) {
        onClose()
      }
    } else {
      showToast('error', NOT_LOGIN_ERROR_MSG)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createTripFunc()
  }

  const {
    tripTitle,
    tripDestination,
    startDate,
    endDate,
    tripTitleError,
    startDateError,
    endDateError,
    isCreateTripFormValid,
    handleTripTitleChange,
    handleTripDestinationChange,
    handleStartDateChange,
    handleEndDateChange,
    handleTripTitleBlur,
    handleTripTitleFocus,
  } = useForm()

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputField
        id="trip-title"
        type="text"
        labelName="旅行タイトル"
        placeholder="例：海の幸を味わう北海道旅"
        maxLength={MAX_TRIP_TITLE_LENGTH}
        value={tripTitle}
        onChange={handleTripTitleChange}
        onBlur={handleTripTitleBlur}
        onFocus={handleTripTitleFocus}
        error={tripTitleError}
      />
      <SelectField
        id="trip-destination"
        labelName="旅行先"
        value={tripDestination}
        items={TRIP_DESTINATION_ITEMS}
        onChange={handleTripDestinationChange}
      />
      <InputField
        id="start-date"
        type="date"
        min={MIN_DATE}
        max={MAX_DATE}
        labelName="開始日"
        value={startDate}
        onChange={handleStartDateChange}
        error={startDateError}
      />
      <InputField
        id="end-date"
        type="date"
        min={MIN_DATE}
        max={MAX_DATE}
        labelName="終了日"
        value={endDate}
        onChange={handleEndDateChange}
        error={endDateError}
      />
      <FormButton
        label="作成"
        isFormValid={isCreateTripFormValid}
        loading={tripApiLoading}
      />
    </form>
  )
}
