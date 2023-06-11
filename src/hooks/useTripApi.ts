import { useRouter } from 'next/router'
import {
  getTripsAPI,
  getTripAPI,
  createTripAPI,
  updateTripAPI,
  deleteTripAPI,
  CreateTripOptions,
  CopyTripOptions,
  UpdateTripOptions,
  DbTripData,
} from '@/api/tripApi'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
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
} from '@/utils/constants'

export const useTripApi = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const { dbTripsData, setTripApiLoading, setDbTripsData } = useAuthContext()

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

      const options: CopyTripOptions = {
        user_id: trip.user_id,
        prefecture_id: trip.prefecture_id,
        title: copiedTitle,
        start_date: trip.start_date,
        end_date: trip.end_date,
        memo: trip.memo,
        image_path: trip.image_path,
        is_public: false,
      }

      const data: DbTripData = await createTripAPI(idToken, user_uid, options)
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
      showToast('success', UPDATE_TRIP_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', UPDATE_TRIP_ERROR_MSG)
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

  return {
    getTrips,
    getTrip,
    createTrip,
    copyTrip,
    updateTrip,
    deleteTrip,
  }
}
