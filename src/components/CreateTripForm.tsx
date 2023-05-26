import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { InputField } from '@/components/InputField'
import { FormButton } from '@/components/FormButton'
import { SelectField } from '@/components/SelectField'
import { useForm } from '@/hooks/useForm'
import { MAX_DATE, MIN_DATE, TRIP_DESTINATION_ITEMS } from '@/utils/constants'

type CreateTripFormProps = {
  onClose: () => void
}

export const CreateTripForm: FC<CreateTripFormProps> = ({ onClose }) => {
  const createTrip = () => {
    return 'createTripは後で作る'
  }

  const createTripFunc = async () => {
    const success = await createTrip()
    if (success) {
      onClose()
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
  } = useForm()

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputField
        id="trip-title"
        type="text"
        labelName="旅行タイトル"
        placeholder="例：海の幸を堪能する北海道旅"
        maxLength={30}
        value={tripTitle}
        onChange={handleTripTitleChange}
        onBlur={handleTripTitleBlur}
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
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        labelName="開始日"
        value={startDate}
        onChange={handleStartDateChange}
        error={startDateError}
      />
      <InputField
        id="end-date"
        type="date"
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        labelName="終了日"
        value={endDate}
        onChange={handleEndDateChange}
        error={endDateError}
      />
      <FormButton label="作成" isFormValid={isCreateTripFormValid} />
    </form>
  )
}
