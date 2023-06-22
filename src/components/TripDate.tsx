import React, { useState } from 'react'
import { ActionButton } from '@/components/ActionButton'
import { AddSpotForm } from '@/components/AddSpotForm'
import { InputField } from '@/components/InputField'
import { Modal } from '@/components/Modal'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTripApi } from '@/hooks/useTripApi'
import { addDay, differenceInDates } from '@/utils/getDate'
import { MIN_DATE_OBJ, MAX_DATE_OBJ, FORM_ADD_SPOT } from '@/utils/constants'

type TripDateProps = {
  start_date: string
  end_date: string
}

export const TripDate: React.FC<TripDateProps> = ({ start_date, end_date }) => {
  const dates = differenceInDates(start_date, end_date)
  const [tripDates, setTripDates] = useState(dates)
  const [selectedDate, setSelectedDate] = useState('')
  const [addSpotModalOpen, setAddSpotModalOpen] = useState(false)
  const { currentUser, selectedTrip, setSelectedTrip } = useAuthContext()
  const { updateTrip } = useTripApi()
  const { showToast } = useToast()

  const onOpenAddSpotModal = (date: string) => {
    setSelectedDate(date)
    setAddSpotModalOpen(true)
  }

  const onCloseAddSpotModal = () => {
    setAddSpotModalOpen(false)
  }

  const updateTripFunc = async (startDate: string, endDate: string) => {
    if (currentUser && selectedTrip) {
      const idToken = await currentUser.getIdToken()
      const success = await updateTrip(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        {
          start_date: startDate,
          end_date: endDate,
        }
      )

      if (success) {
        setSelectedTrip(success)
      }
    } else {
      showToast('error', 'ログインしてください。')
    }
  }

  const handleStartDateChange =
    (i: number, minDateString: string, maxDateString: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let selectedDate = new Date(event.target.value)
      if (isNaN(selectedDate.getTime())) {
        return
      }

      const minDate = new Date(minDateString)
      const maxDate = new Date(maxDateString)

      if (selectedDate < minDate) {
        selectedDate = minDate
      } else if (selectedDate > maxDate) {
        selectedDate = maxDate
      }

      const newTripDates = Array.from(
        { length: tripDates.length },
        (_, index) => {
          return addDay(selectedDate, index - i)
        }
      )
      setTripDates(newTripDates)

      const startDate = newTripDates[0]
      const endDate = newTripDates[newTripDates.length - 1]
      updateTripFunc(startDate, endDate)
    }

  return (
    <div className="m-4 space-y-4">
      {tripDates.map((_, i) => {
        const minDate = addDay(MIN_DATE_OBJ, i)
        const maxDate = addDay(MAX_DATE_OBJ, i + 1 - tripDates.length)
        return (
          <div key={i} className="flex flex-col space-y-2">
            <InputField
              id={`day${i + 1}`}
              type="date"
              min={minDate}
              max={maxDate}
              labelName={`${i + 1}日目`}
              value={tripDates[i]}
              onChange={handleStartDateChange(i, minDate, maxDate)}
              isTripDate={true}
            />
            <ActionButton
              text="スポットを追加"
              onClick={() => onOpenAddSpotModal(tripDates[i])}
              showPlusIcon={true}
            />
          </div>
        )
      })}
      {addSpotModalOpen && (
        <Modal
          open={addSpotModalOpen}
          onClose={onCloseAddSpotModal}
          title={FORM_ADD_SPOT}
        >
          <AddSpotForm onClose={onCloseAddSpotModal} date={selectedDate} />
        </Modal>
      )}
    </div>
  )
}
