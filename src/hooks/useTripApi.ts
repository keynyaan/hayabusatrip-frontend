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
import {
  CREATE_TRIP_SUCCESS_MSG,
  UPDATE_TRIP_SUCCESS_MSG,
  DELETE_TRIP_SUCCESS_MSG,
  GET_TRIP_ERROR_MSG,
  CREATE_TRIP_ERROR_MSG,
  UPDATE_TRIP_ERROR_MSG,
  DELETE_TRIP_ERROR_MSG,
} from '@/utils/constants'

export const useTripApi = () => {
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

  const getTrip = async (
    idToken: string,
    user_uid: string,
    trip_token: string
  ) => {
    setTripApiLoading(true)
    try {
      const data: DbTripData = await getTripAPI(idToken, user_uid, trip_token)
      return data
    } catch (e) {
      showToast('error', GET_TRIP_ERROR_MSG)
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
      showToast('success', CREATE_TRIP_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', CREATE_TRIP_ERROR_MSG)
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
      const data: DbTripData = await deleteTripAPI(
        idToken,
        user_uid,
        trip_token
      )
      showToast('success', DELETE_TRIP_SUCCESS_MSG)
      return data
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
    updateTrip,
    deleteTrip,
  }
}
