import React, { useEffect, useState } from 'react'
import { differenceInMinutes, parseISO } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { ActionButton } from '@/components/ActionButton'
import { DeleteTripDateForm } from '@/components/DeleteTripDateForm'
import { InputField } from '@/components/InputField'
import { Modal } from '@/components/Modal'
import { SpotCard } from '@/components/SpotCard'
import { SpotForm } from '@/components/SpotForm'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useSpotApi } from '@/hooks/useSpotApi'
import { useTripApi } from '@/hooks/useTripApi'
import {
  MIN_DATE_OBJ,
  MAX_DATE_OBJ,
  FORM_ADD_SPOT,
  SPOT_FORM_MODE_CREATE,
  FORM_DELETE_TRIP_DATE,
  UPDATE_SPOT_MIN_BASE_DATE,
} from '@/utils/constants'
import {
  addDay,
  differenceInDates,
  differenceInDatesStr,
  getJapaneseDay,
} from '@/utils/getDate'

export const TripDate: React.FC = ({}) => {
  const {
    currentUser,
    selectedTrip,
    dbUserData,
    dbSpotsData,
    setSelectedTrip,
  } = useAuthContext()
  const { updateSpot } = useSpotApi()
  const { updateTrip } = useTripApi()
  const { showToast } = useToast()
  const initialTripDates = selectedTrip
    ? differenceInDates(selectedTrip.start_date, selectedTrip.end_date)
    : []
  const [tripDates, setTripDates] = useState(initialTripDates)
  const [selectedDate, setSelectedDate] = useState('')
  const [addSpotModalOpen, setAddSpotModalOpen] = useState(false)
  const [deleteDateModalOpen, setDeleteDateModalOpen] = useState(false)

  const isOwner = selectedTrip?.user_id === dbUserData?.id
  const isDayTrip = selectedTrip?.start_date === selectedTrip?.end_date

  const onOpenAddSpotModal = (date: string) => {
    setSelectedDate(date)
    setAddSpotModalOpen(true)
  }

  const onOpenDeleteDateModal = (date: string) => {
    setSelectedDate(date)
    setDeleteDateModalOpen(true)
  }

  const onCloseAddSpotModal = () => {
    setAddSpotModalOpen(false)
  }

  const onCloseDeleteDateModal = () => {
    setDeleteDateModalOpen(false)
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

  const updateSpotFunc = async (base_date: string, date_offset: string) => {
    if (currentUser && selectedTrip) {
      const idToken = await currentUser.getIdToken()
      await updateSpot(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        undefined,
        undefined,
        base_date,
        date_offset,
        true
      )
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
      const date_offset = differenceInDatesStr(newTripDates[0], tripDates[0])

      updateTripFunc(startDate, endDate)
      updateSpotFunc(UPDATE_SPOT_MIN_BASE_DATE, date_offset)
    }

  useEffect(() => {
    if (selectedTrip) {
      const dates = differenceInDates(
        selectedTrip.start_date,
        selectedTrip.end_date
      )
      setTripDates(dates)
    }
  }, [selectedTrip])

  if (!selectedTrip) return null

  return (
    <div className="m-4 space-y-4">
      {tripDates.map((_, i) => {
        const minDate = addDay(MIN_DATE_OBJ, i)
        const maxDate = addDay(MAX_DATE_OBJ, i + 1 - tripDates.length)
        const spotsForDate = getSpotsForDate(tripDates[i])

        return (
          <div key={i} className="flex flex-col space-y-2">
            {isOwner ? (
              <div className="flex items-center space-x-2">
                <InputField
                  id={`day${i + 1}`}
                  type="date"
                  min={minDate}
                  max={maxDate}
                  labelName={`${i + 1}日目`}
                  value={tripDates[i]}
                  onChange={handleStartDateChange(i, minDate, maxDate)}
                  isTripDate={true}
                  fullClickableDate={true}
                  tabIndex={-1}
                />
                {!isDayTrip && (
                  <div
                    className="w-10 h-10 transition-all p-2 text-red-500 hover:text-white rounded-full  hover:bg-red-500 flex items-center justify-center cursor-pointer"
                    onClick={() => onOpenDeleteDateModal(tripDates[i])}
                  >
                    <FontAwesomeIcon icon={faTrashCan} size="lg" />
                  </div>
                )}
              </div>
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
      {deleteDateModalOpen && (
        <Modal
          open={deleteDateModalOpen}
          onClose={onCloseDeleteDateModal}
          title={FORM_DELETE_TRIP_DATE}
        >
          <DeleteTripDateForm
            onClose={onCloseDeleteDateModal}
            date={selectedDate}
          />
        </Modal>
      )}
    </div>
  )
}
