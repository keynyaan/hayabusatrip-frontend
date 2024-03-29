import React, { useEffect } from 'react'
import { FormButton } from '@/components/FormButton'
import { TextareaField } from '@/components/TextareaField'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useForm } from '@/hooks/useForm'
import { useTripApi } from '@/hooks/useTripApi'
import {
  MAX_TRIP_MEMO,
  NOT_LOGIN_ERROR_MSG,
  TRIP_MEMO_ROWS,
  UPDATE_TRIP_MEMO_ERROR_MSG,
  UPDATE_TRIP_MEMO_SUCCESS_MSG,
} from '@/utils/constants'

type TripMemoProps = {
  viewMode: boolean
}

export const TripMemo: React.FC<TripMemoProps> = ({ viewMode }) => {
  const { currentUser, selectedTrip, tripApiLoading } = useAuthContext()
  const {
    tripMemo,
    tripMemoError,
    isTripMemoFormValid,
    handleTripMemoChange,
    handleTripMemoBlur,
  } = useForm()
  const { updateTrip } = useTripApi()
  const { showToast } = useToast()

  const updateTripMemoFunc = async () => {
    if (currentUser && selectedTrip) {
      const idToken = await currentUser.getIdToken()
      await updateTrip(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        {
          memo: tripMemo,
        },
        UPDATE_TRIP_MEMO_SUCCESS_MSG,
        UPDATE_TRIP_MEMO_ERROR_MSG
      )
    } else {
      showToast('error', NOT_LOGIN_ERROR_MSG)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateTripMemoFunc()
  }

  useEffect(() => {
    if (selectedTrip) {
      handleTripMemoChange({
        target: { value: selectedTrip.memo },
      } as React.ChangeEvent<HTMLTextAreaElement>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip])

  return viewMode ? (
    <div className="mx-4">
      <TextareaField
        id="trip-memo"
        labelName="メモ"
        value={tripMemo}
        srOnly={true}
        rows={TRIP_MEMO_ROWS}
        readOnly={true}
      />
    </div>
  ) : (
    <form className="mx-4 space-y-4" onSubmit={handleSubmit}>
      <TextareaField
        id="trip-memo"
        labelName="メモ"
        value={tripMemo}
        srOnly={true}
        placeholder="旅行の持ち物や共有事項などを自由にメモしてください。"
        onChange={handleTripMemoChange}
        onBlur={handleTripMemoBlur}
        error={tripMemoError}
        maxLength={MAX_TRIP_MEMO}
        rows={TRIP_MEMO_ROWS}
      />
      <FormButton
        label="更新"
        isFormValid={isTripMemoFormValid}
        loading={tripApiLoading}
      />
    </form>
  )
}
