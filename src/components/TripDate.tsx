import React, { useState } from 'react'
import { differenceInMinutes, parseISO } from 'date-fns'
import { ActionButton } from '@/components/ActionButton'
import { SpotForm } from '@/components/SpotForm'
import { InputField } from '@/components/InputField'
import { Modal } from '@/components/Modal'
import { SpotCard } from '@/components/SpotCard'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTripApi } from '@/hooks/useTripApi'
import {
  MIN_DATE_OBJ,
  MAX_DATE_OBJ,
  FORM_ADD_SPOT,
  SPOT_FORM_MODE_CREATE,
} from '@/utils/constants'
import { addDay, differenceInDates, getJapaneseDay } from '@/utils/getDate'
type TripDateProps = {
  start_date: string
  end_date: string
}

export const TripDate: React.FC<TripDateProps> = ({ start_date, end_date }) => {
  const dates = differenceInDates(start_date, end_date)
  const [tripDates, setTripDates] = useState(dates)
  const [selectedDate, setSelectedDate] = useState('')
  const [addSpotModalOpen, setAddSpotModalOpen] = useState(false)
  const {
    currentUser,
    selectedTrip,
    dbUserData,
    dbSpotsData,
    setSelectedTrip,
  } = useAuthContext()
  const { updateTrip } = useTripApi()
  const { showToast } = useToast()

  const isOwner = selectedTrip?.user_id === dbUserData?.id

  const onOpenAddSpotModal = (date: string) => {
    setSelectedDate(date)
    setAddSpotModalOpen(true)
  }

  const onCloseAddSpotModal = () => {
    setAddSpotModalOpen(false)
  }

  const getSpotsForDate = (date: string) => {
    const spots = dbSpotsData?.filter((spot) => spot.date === date)

    return spots?.sort((a, b) => {
      const startTimeA = parseISO(a.start_time)
      const startTimeB = parseISO(b.start_time)
      const durationA = differenceInMinutes(parseISO(a.end_time), startTimeA)
      const durationB = differenceInMinutes(parseISO(b.end_time), startTimeB)

      // 開始時間の昇順でソート
      if (startTimeA < startTimeB) {
        return -1
      }
      if (startTimeA > startTimeB) {
        return 1
      }

      // 開始時間が同じ時、開始終了間隔の昇順でソート
      if (durationA < durationB) {
        return -1
      }
      if (durationA > durationB) {
        return 1
      }

      return 0
    })
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
        const spotsForDate = getSpotsForDate(tripDates[i])

        return (
          <div key={i} className="flex flex-col space-y-2">
            {isOwner ? (
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
            ) : (
              <div className={`relative flex items-center`}>
                <p className={`text-gray-500 whitespace-nowrap`}>
                  {`${i + 1}日目`}
                </p>
                <p className={`w-full px-3 py-2 text-gray-700`}>
                  {getJapaneseDay(tripDates[i])}
                </p>
              </div>
            )}
            {spotsForDate?.map((spot, index) => (
              <div key={index}>
                <SpotCard spot={spot} />
              </div>
            ))}
            {isOwner && (
              <ActionButton
                text="スポットを追加"
                onClick={() => onOpenAddSpotModal(tripDates[i])}
                showPlusIcon={true}
              />
            )}
          </div>
        )
      })}
      {addSpotModalOpen && (
        <Modal
          open={addSpotModalOpen}
          onClose={onCloseAddSpotModal}
          title={FORM_ADD_SPOT}
        >
          <SpotForm
            onClose={onCloseAddSpotModal}
            mode={SPOT_FORM_MODE_CREATE}
            date={selectedDate}
          />
        </Modal>
      )}
    </div>
  )
}
