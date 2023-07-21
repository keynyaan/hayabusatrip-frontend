import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { differenceInMinutes, parseISO } from 'date-fns'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthContext } from '@/context/AuthContext'
import { DescriptionViewMode } from '@/components/DescriptionViewMode'
import { Meta } from '@/components/Meta'
import { Modal } from '@/components/Modal'
import { NotFound } from '@/components/NotFound'
import { Spinner } from '@/components/Spinner'
import { SwitchButton } from '@/components/SwitchButton'
import { TripCard } from '@/components/TripCard'
import { TripCost } from '@/components/TripCost'
import { TripDate } from '@/components/TripDate'
import { TripMemo } from '@/components/TripMemo'
import { useSpotApi } from '@/hooks/useSpotApi'
import { useTripApi } from '@/hooks/useTripApi'
import {
  GET_TRIP_ERROR_MSG,
  TRIP_TAB,
  COST_TAB,
  MEMO_TAB,
  DESCRIPTION_VIEW_MODE,
  TRIP_DESC_PAGE_DESC,
  TRIP_DESC_PAGE_TITLE,
} from '@/utils/constants'
import { differenceInDates } from '@/utils/getDate'

export default function TripDetail() {
  const router = useRouter()
  const { trip_token } = router.query
  const {
    currentUser,
    dbUserData,
    selectedTrip,
    dbSpotsData,
    setSelectedTrip,
    setDbSpotsData,
  } = useAuthContext()
  const { getSpots } = useSpotApi()
  const { getTrip } = useTripApi()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [showNotFound, setShowNotFound] = useState(false)
  const [selectedTab, setSelectedTab] = useState<
    typeof TRIP_TAB | typeof COST_TAB | typeof MEMO_TAB
  >(TRIP_TAB)

  const initialTripDates = selectedTrip
    ? differenceInDates(selectedTrip.start_date, selectedTrip.end_date)
    : []
  const [tripDates, setTripDates] = useState(initialTripDates)
  const [isOwner, setIsOwner] = useState(false)
  const [viewMode, setViewMode] = useState(true)
  const [descriptionViewModeModalOpen, setDescriptionViewModeModalOpen] =
    useState(false)

  const handleChange = () => {
    setViewMode(!viewMode)
  }

  const onOpenDescriptionViewModeModal = () => {
    setDescriptionViewModeModalOpen(true)
  }

  const onCloseDescriptionViewModeModal = () => {
    setDescriptionViewModeModalOpen(false)
  }

  const getSpotsForDate = (date: string, items?: string[]) => {
    const spots = dbSpotsData?.filter(
      (spot) =>
        spot.date === date && (items ? items.includes(spot.spot_icon) : true)
    )

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

  const fetchInitialData = async () => {
    try {
      const selectedTripData = await getTrip(
        trip_token as string,
        currentUser?.uid
      )

      if (!selectedTripData) {
        throw new Error(GET_TRIP_ERROR_MSG)
      }

      setSelectedTrip(selectedTripData)

      const dbSpotsData = await getSpots(trip_token as string, currentUser?.uid)

      if (dbSpotsData) {
        setDbSpotsData(dbSpotsData)
      }
    } catch (e) {
      setShowNotFound(true)
    } finally {
      setIsDataLoading(false)
    }
  }

  useEffect(() => {
    if (typeof trip_token === 'string' && currentUser !== undefined) {
      fetchInitialData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip_token, currentUser])

  useEffect(() => {
    if (selectedTrip) {
      const dates = differenceInDates(
        selectedTrip.start_date,
        selectedTrip.end_date
      )
      setTripDates(dates)
    }
  }, [selectedTrip])

  useEffect(() => {
    if (selectedTrip && dbUserData) {
      const isOwner = selectedTrip.user_id === dbUserData.id
      setIsOwner(isOwner)
      setViewMode(!isOwner)
    }
  }, [selectedTrip, dbUserData])

  if (isDataLoading) {
    return <Spinner />
  }

  if (showNotFound) {
    return <NotFound />
  }

  return (
    <>
      <Meta pageTitle={TRIP_DESC_PAGE_TITLE} pageDesc={TRIP_DESC_PAGE_DESC} />
      <div className="m-4 space-y-6 max-w-md mx-auto">
        <TripCard trip={selectedTrip} isDetailPage={true} viewMode={viewMode} />

        {isOwner && (
          <div className="flex items-center justify-center space-x-1">
            <FontAwesomeIcon
              icon={faCircleQuestion}
              className="text-sm sm:text-base text-gray-700 hover:text-brand-color transition cursor-pointer"
              onClick={onOpenDescriptionViewModeModal}
            />
            <SwitchButton
              label="閲覧モード"
              checked={viewMode}
              onChange={handleChange}
            />
          </div>
        )}

        {descriptionViewModeModalOpen && (
          <Modal
            open={descriptionViewModeModalOpen}
            onClose={onCloseDescriptionViewModeModal}
            title={DESCRIPTION_VIEW_MODE}
            initialCloseButtonBlur={true}
          >
            <DescriptionViewMode />
          </Modal>
        )}

        <div className="flex">
          <div
            className={`tab-item ${selectedTab === TRIP_TAB ? 'active' : ''}`}
            onClick={() => setSelectedTab(TRIP_TAB)}
          >
            旅行
          </div>
          <div
            className={`tab-item ${selectedTab === COST_TAB ? 'active' : ''}`}
            onClick={() => setSelectedTab(COST_TAB)}
          >
            費用
          </div>
          <div
            className={`tab-item ${selectedTab === MEMO_TAB ? 'active' : ''}`}
            onClick={() => setSelectedTab(MEMO_TAB)}
          >
            メモ
          </div>
        </div>

        {selectedTab === TRIP_TAB && (
          <TripDate
            tripDates={tripDates}
            viewMode={viewMode}
            setTripDates={setTripDates}
            getSpotsForDate={getSpotsForDate}
          />
        )}
        {selectedTab === COST_TAB && (
          <TripCost tripDates={tripDates} getSpotsForDate={getSpotsForDate} />
        )}
        {selectedTab === MEMO_TAB && <TripMemo viewMode={viewMode} />}
      </div>
    </>
  )
}
