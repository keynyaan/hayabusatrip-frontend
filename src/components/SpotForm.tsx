import React, { FC, useEffect } from 'react'
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
  SPOT_FORM_MODE_CREATE,
  SPOT_FORM_MODE_UPDATE,
  SPOT_CATEGORY_OPTIONS,
  SPOT_MEMO_ROWS,
  TRIP_DESTINATION_ITEMS,
} from '@/utils/constants'
import { getTimeFromString } from '@/utils/getDate'

type SpotFormProps = {
  onClose: () => void
  mode: typeof SPOT_FORM_MODE_CREATE | typeof SPOT_FORM_MODE_UPDATE
  date: string
}

export const SpotForm: FC<SpotFormProps> = ({ onClose, mode, date }) => {
  const { currentUser, dbUserData, selectedTrip, selectedSpot } =
    useAuthContext()
  const { createSpot, updateSpot } = useSpotApi()
  const { showToast } = useToast()
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
    isSpotFormValid,
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

  const selectedTripItem = TRIP_DESTINATION_ITEMS.find(
    (item) => item.value === String(selectedTrip?.prefecture_id)
  )
  const selectedOption =
    SPOT_CATEGORY_OPTIONS.find((option) => option.value === spotCategory) ||
    SPOT_CATEGORY_OPTIONS[0]

  const createSpotFunc = async () => {
    if (currentUser && dbUserData && selectedTrip) {
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

  const updateSpotFunc = async () => {
    if (currentUser && dbUserData && selectedTrip && selectedSpot) {
      const idToken = await currentUser.getIdToken()
      const success = await updateSpot(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        selectedSpot.id,
        {
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
    mode === SPOT_FORM_MODE_CREATE ? createSpotFunc() : updateSpotFunc()
  }

  useEffect(() => {
    if (mode === SPOT_FORM_MODE_UPDATE && selectedSpot) {
      handleSpotNameChange({
        target: { value: selectedSpot.title },
      } as React.ChangeEvent<HTMLInputElement>)

      const spotCategoryOption = SPOT_CATEGORY_OPTIONS.find(
        (option) => option.value === selectedSpot.spot_icon
      )
      if (spotCategoryOption) {
        handleSpotCategoryChange(spotCategoryOption)
      }

      handleStartTimeChange({
        target: { value: getTimeFromString(selectedSpot.start_time) },
      } as React.ChangeEvent<HTMLInputElement>)

      handleEndTimeChange({
        target: { value: getTimeFromString(selectedSpot.end_time) },
      } as React.ChangeEvent<HTMLInputElement>)

      handleCostChange({
        target: { value: String(selectedSpot.cost) },
      } as React.ChangeEvent<HTMLInputElement>)

      handleSpotMemoChange({
        target: { value: selectedSpot.memo },
      } as React.ChangeEvent<HTMLTextAreaElement>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedSpot])

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputField
        id="spot-date"
        type="date"
        labelName="日付"
        value={date}
        disabled={true}
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
        rows={SPOT_MEMO_ROWS}
        resizeNone={true}
      />

      <FormButton
        label={mode === SPOT_FORM_MODE_CREATE ? '追加' : '更新'}
        isFormValid={isSpotFormValid}
        isSpotApi={true}
      />
    </form>
  )
}
