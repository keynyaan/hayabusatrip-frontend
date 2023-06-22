import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { SelectWithIconField } from '@/components/SelectWithIconField'
import { FormButton } from '@/components/FormButton'
import { InputField } from '@/components/InputField'
import { TextareaField } from '@/components/TextareaField'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useForm } from '@/hooks/useForm'
import { useSpotApi } from '@/hooks/useSpotApi'
import {
  MAX_COST_LENGTH,
  MAX_SPOT_MEMO,
  MAX_SPOT_NAME,
  SPOT_CATEGORY_OPTIONS,
  SPOT_ROWS,
  TRIP_DESTINATION_ITEMS,
} from '@/utils/constants'

type AddSpotFormProps = {
  onClose: () => void
  date: string
}

export const AddSpotForm: FC<AddSpotFormProps> = ({ onClose, date }) => {
  const { currentUser, dbUserData, selectedTrip } = useAuthContext()
  const { createSpot } = useSpotApi()
  const { showToast } = useToast()
  const selectedTripItem = TRIP_DESTINATION_ITEMS.find(
    (item) => item.value === String(selectedTrip?.prefecture_id)
  )
  const selectedOption =
    SPOT_CATEGORY_OPTIONS.find((option) => option.value === spotCategory) ||
    SPOT_CATEGORY_OPTIONS[0]

  const createSpotFunc = async () => {
    if (currentUser && dbUserData && selectedTrip) {
      console.log(startTime)
      const idToken = await currentUser.getIdToken()
      const success = await createSpot(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        {
          trip_id: selectedTrip.id,
          spot_icon: spotCategory,
          title: spotName,
          date: date,
          start_time: startTime,
          end_time: endTime,
          cost: parseInt(cost),
          memo: spotMemo,
        }
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
    createSpotFunc()
  }

  const {
    spotName,
    spotCategory,
    startTime,
    endTime,
    cost,
    spotMemo,
    spotNameError,
    startTimeError,
    endTimeError,
    costError,
    spotMemoError,
    isAddSpotFormValid,
    handleSpotNameChange,
    handleSpotCategoryChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleCostChange,
    handleSpotMemoChange,
    handleSpotNameBlur,
    handleStartTimeBlur,
    handleEndTimeBlur,
    handleCostBlur,
    handleSpotMemoBlur,
  } = useForm()

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputField
        id="spot-date"
        type="date"
        labelName="日付"
        value={date}
        readonly={true}
      />

      <InputField
        id="spot-name"
        type="text"
        labelName="スポット名"
        placeholder={`例：${selectedTripItem?.spotName}`}
        maxLength={MAX_SPOT_NAME}
        value={spotName}
        onChange={handleSpotNameChange}
        onBlur={handleSpotNameBlur}
        error={spotNameError}
      />

      <SelectWithIconField
        id="spot-category"
        labelName="カテゴリー"
        options={SPOT_CATEGORY_OPTIONS}
        value={selectedOption}
        onChange={handleSpotCategoryChange}
      />

      <div className="flex justify-between space-x-4">
        <div className="w-28">
          <InputField
            id="start-time"
            type="time"
            labelName="開始時間"
            value={startTime}
            onChange={handleStartTimeChange}
            onBlur={handleStartTimeBlur}
            error={startTimeError}
          />
        </div>
        <div className="w-28">
          <InputField
            id="end-time"
            type="time"
            labelName="終了時間"
            value={endTime}
            onChange={handleEndTimeChange}
            onBlur={handleEndTimeBlur}
            error={endTimeError}
          />
        </div>
      </div>

      <InputField
        id="cost"
        type="text"
        labelName="費用"
        value={cost}
        maxLength={MAX_COST_LENGTH}
        onChange={handleCostChange}
        onBlur={handleCostBlur}
        error={costError}
        inputmode="numeric"
        pattern="\d*"
      />

      <TextareaField
        id="spot-memo"
        labelName="一言メモ"
        value={spotMemo}
        onChange={handleSpotMemoChange}
        onBlur={handleSpotMemoBlur}
        error={spotMemoError}
        maxLength={MAX_SPOT_MEMO}
        rows={SPOT_ROWS}
      />

      <FormButton
        label="追加"
        isFormValid={isAddSpotFormValid}
        isSpotApi={true}
      />
    </form>
  )
}
