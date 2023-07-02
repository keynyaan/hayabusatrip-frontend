import { useRouter } from 'next/router'
import {
  getTripsAPI,
  getTripAPI,
  createTripAPI,
  updateTripAPI,
  deleteTripAPI,
  CreateTripOptions,
  UpdateTripOptions,
  DbTripData,
} from '@/api/tripApi'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useSpotApi } from '@/hooks/useSpotApi'
import {
  CREATE_TRIP_SUCCESS_MSG,
  COPY_TRIP_SUCCESS_MSG,
  UPDATE_TRIP_SUCCESS_MSG,
  DELETE_TRIP_SUCCESS_MSG,
  GET_TRIP_ERROR_MSG,
  CREATE_TRIP_ERROR_MSG,
  COPY_TRIP_ERROR_MSG,
  UPDATE_TRIP_ERROR_MSG,
  DELETE_TRIP_ERROR_MSG,
  COPY_SUFFIX,
  COPY_TRIP_TITLE_ERROR_MSG,
  MAX_TRIP_TITLE_LENGTH,
  HTTP_STATUS_NO_CONTENT,
  DELETE_TRIP_DATE_ERROR_MSG,
  DELETE_TRIP_DATE_SUCCESS_MSG,
  UPDATE_TRIP_MEMO_SUCCESS_MSG,
  UPDATE_TRIP_MEMO_ERROR_MSG,
} from '@/utils/constants'
import { getNextDay, getPreviousDay } from '@/utils/getDate'

export const useTripApi = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const {
    dbTripsData,
    selectedTrip,
    dbSpotsData,
    setTripApiLoading,
    setDbTripsData,
    setSelectedTrip,
  } = useAuthContext()
  const { updateSpot, deleteSpot } = useSpotApi()

  const getTrips = async (idToken: string, user_uid: string) => {
    setTripApiLoading(true)
    try {
      const data: DbTripData[] = await getTripsAPI(idToken, user_uid)
      return data
    } catch (e) {
      showToast('error', GET_TRIP_ERROR_MSG)
    } finally {
      setTripApiLoading(false)
    }
  }

  const getTrip = async (trip_token: string, user_uid?: string) => {
    setTripApiLoading(true)
    try {
      const data: DbTripData = await getTripAPI(trip_token, user_uid)
      return data
    } catch (e) {
      // 利用側のコードで、404ページを返すため何もしない
    } finally {
      setTripApiLoading(false)
    }
  }

  const createTrip = async (
    idToken: string,
    user_uid: string,
    options: CreateTripOptions
  ) => {
    setTripApiLoading(true)
    try {
      const data: DbTripData = await createTripAPI(idToken, user_uid, options)
      setDbTripsData([...(dbTripsData || []), data])
      await router.push('/')
      showToast('success', CREATE_TRIP_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', CREATE_TRIP_ERROR_MSG)
    } finally {
      setTripApiLoading(false)
    }
  }

  const copyTrip = async (
    idToken: string,
    user_uid: string,
    trip: DbTripData
  ) => {
    setTripApiLoading(true)

    try {
      const copiedTitle = trip.title + COPY_SUFFIX

      if (copiedTitle.length > MAX_TRIP_TITLE_LENGTH) {
        showToast('error', COPY_TRIP_TITLE_ERROR_MSG)
        return
      }

      const data: DbTripData = await createTripAPI(
        idToken,
        user_uid,
        undefined,
        trip.trip_token
      )
      setDbTripsData([...(dbTripsData || []), data])
      showToast('success', COPY_TRIP_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', COPY_TRIP_ERROR_MSG)
    } finally {
      setTripApiLoading(false)
    }
  }

  const updateTrip = async (
    idToken: string,
    user_uid: string,
    trip_token: string,
    options: UpdateTripOptions
  ) => {
    setTripApiLoading(true)
    const isMemo = options.memo !== undefined
    try {
      const data: DbTripData = await updateTripAPI(
        idToken,
        user_uid,
        trip_token,
        options
      )
      if (dbTripsData) {
        const updatedTripsData = dbTripsData.map((tripData: DbTripData) =>
          tripData.trip_token === trip_token ? data : tripData
        )
        setDbTripsData(updatedTripsData)
      }

      if (selectedTrip) {
        setSelectedTrip(data)
      }

      showToast(
        'success',
        `${isMemo ? UPDATE_TRIP_MEMO_SUCCESS_MSG : UPDATE_TRIP_SUCCESS_MSG}`
      )
      return data
    } catch (e) {
      showToast(
        'error',
        `${isMemo ? UPDATE_TRIP_MEMO_ERROR_MSG : UPDATE_TRIP_ERROR_MSG}`
      )
    } finally {
      setTripApiLoading(false)
    }
  }

  const deleteTrip = async (
    idToken: string,
    user_uid: string,
    trip_token: string
  ) => {
    setTripApiLoading(true)
    try {
      const statusCode: number = await deleteTripAPI(
        idToken,
        user_uid,
        trip_token
      )
      if (statusCode === HTTP_STATUS_NO_CONTENT) {
        if (dbTripsData) {
          const updatedTripsData = dbTripsData.filter(
            (tripData: DbTripData) => tripData.trip_token !== trip_token
          )
          setDbTripsData(updatedTripsData)
        }
        await router.push('/')
        showToast('success', DELETE_TRIP_SUCCESS_MSG)
        return true
      } else {
        showToast('error', DELETE_TRIP_ERROR_MSG)
        return false
      }
    } catch (e) {
      showToast('error', DELETE_TRIP_ERROR_MSG)
    } finally {
      setTripApiLoading(false)
    }
  }

  const deleteTripDate = async (
    idToken: string,
    user_uid: string,
    trip_token: string,
    date: string
  ) => {
    setTripApiLoading(true)
    if (!selectedTrip) {
      throw new Error('selectedTrip must be provided.')
    }

    try {
      let newStartDate = selectedTrip.start_date
      let newEndDate = selectedTrip.end_date
      const isInBetweenDay = date !== newStartDate && date !== newEndDate

      if (date === newStartDate) {
        newStartDate = getNextDay(newStartDate)
      } else {
        newEndDate = getPreviousDay(newEndDate)
      }

      const data: DbTripData = await updateTripAPI(
        idToken,
        user_uid,
        trip_token,
        {
          start_date: newStartDate,
          end_date: newEndDate,
        }
      )
      if (dbTripsData) {
        const updatedTripsData = dbTripsData.map((tripData: DbTripData) =>
          tripData.trip_token === trip_token ? data : tripData
        )
        setDbTripsData(updatedTripsData)
      }
      if (selectedTrip) {
        setSelectedTrip(data)
      }

      if (Boolean(dbSpotsData?.length)) {
        await deleteSpot(idToken, user_uid, trip_token, undefined, date, true)

        if (isInBetweenDay) {
          // 削除した旅行日の日付分、スポットの日付を1日前倒しする
          await updateSpot(
            idToken,
            user_uid,
            trip_token,
            undefined,
            undefined,
            date,
            '-1',
            true
          )
        }
      }

      showToast('success', DELETE_TRIP_DATE_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', DELETE_TRIP_DATE_ERROR_MSG)
    } finally {
      setTripApiLoading(false)
    }
  }

  return {
    getTrips,
    getTrip,
    createTrip,
    copyTrip,
    updateTrip,
    deleteTrip,
    deleteTripDate,
  }
}
