import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthContext } from '@/context/AuthContext'
import { NotFound } from '@/components/NotFound'
import { Spinner } from '@/components/Spinner'
import { TripCard } from '@/components/TripCard'
import { TripDate } from '@/components/TripDate'
import { useSpotApi } from '@/hooks/useSpotApi'
import { useTripApi } from '@/hooks/useTripApi'
import { GET_TRIP_ERROR_MSG } from '@/utils/constants'

export default function TripDetail() {
  const router = useRouter()
  const { trip_token } = router.query
  const { currentUser, selectedTrip, setSelectedTrip, setDbSpotsData } =
    useAuthContext()
  const { getSpots } = useSpotApi()
  const { getTrip } = useTripApi()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [showNotFound, setShowNotFound] = useState(false)

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

  if (isDataLoading) {
    return <Spinner />
  }

  if (showNotFound) {
    return <NotFound />
  }

  if (!selectedTrip) {
    return null
  }

  return (
    <div className="m-4 space-y-4 max-w-md mx-auto">
      <TripCard trip={selectedTrip} isDetailPage={true} />
      <TripDate
        start_date={selectedTrip.start_date}
        end_date={selectedTrip.end_date}
      />
    </div>
  )
}
