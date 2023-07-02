import React, { Dispatch, SetStateAction, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { DbSpotData } from '@/api/spotApi'
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
import { addDay, differenceInDatesStr, getJapaneseDay } from '@/utils/getDate'

type TripDateProps = {
  tripDates: string[]
  isOwner: boolean
  setTripDates: Dispatch<SetStateAction<string[]>>
  getSpotsForDate: (date: string, items?: string[]) => DbSpotData[] | undefined
}

export const TripDate: React.FC<TripDateProps> = ({
  tripDates,
  isOwner,
  setTripDates,
  getSpotsForDate,
}) => {
  const { currentUser, selectedTrip } = useAuthContext()
  const { updateSpot } = useSpotApi()
  const { updateTrip } = useTripApi()
  const { showToast } = useToast()
  const [selectedDate, setSelectedDate] = useState('')
  const [addSpotModalOpen, setAddSpotModalOpen] = useState(false)
  const [deleteDateModalOpen, setDeleteDateModalOpen] = useState(false)

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

  const updateTripFunc = async (startDate: string, endDate: string) => {
    if (currentUser && selectedTrip) {
      const idToken = await currentUser.getIdToken()
      await updateTrip(idToken, currentUser.uid, selectedTrip.trip_token, {
        start_date: startDate,
        end_date: endDate,
      })
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

  return (
    <div className="m-4 space-y-20">
      {tripDates.map((date, i) => {
        const minDate = addDay(MIN_DATE_OBJ, i)
        const maxDate = addDay(MAX_DATE_OBJ, i + 1 - tripDates.length)
        const spotsForDate = getSpotsForDate(date)

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
                  value={date}
                  onChange={handleStartDateChange(i, minDate, maxDate)}
                  isTripDate={true}
                  fullClickableDate={true}
                  tabIndex={-1}
                />
                {!isDayTrip && (
                  <div
                    className="w-10 h-10 transition-all p-2 text-red-500 hover:text-white rounded-full  hover:bg-red-500 flex items-center justify-center cursor-pointer"
                    onClick={() => onOpenDeleteDateModal(date)}
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
                  {getJapaneseDay(date)}
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
                onClick={() => onOpenAddSpotModal(date)}
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
