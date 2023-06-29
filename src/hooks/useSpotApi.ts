import {
  getSpotsAPI,
  getSpotAPI,
  createSpotAPI,
  updateSpotAPI,
  deleteSpotAPI,
  CreateSpotOptions,
  UpdateSpotOptions,
  DbSpotData,
} from '@/api/spotApi'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import {
  CREATE_SPOT_SUCCESS_MSG,
  UPDATE_SPOT_SUCCESS_MSG,
  DELETE_SPOT_SUCCESS_MSG,
  GET_SPOT_ERROR_MSG,
  CREATE_SPOT_ERROR_MSG,
  UPDATE_SPOT_ERROR_MSG,
  DELETE_SPOT_ERROR_MSG,
  HTTP_STATUS_NO_CONTENT,
} from '@/utils/constants'

export const useSpotApi = () => {
  const { showToast } = useToast()
  const { dbSpotsData, setSpotApiLoading, setDbSpotsData } = useAuthContext()

  const getSpots = async (trip_token: string, user_uid?: string) => {
    setSpotApiLoading(true)
    try {
      const data: DbSpotData[] = await getSpotsAPI(trip_token, user_uid)
      return data
    } catch (e) {
      // 利用側のコードで、404ページを返すため何もしない
    } finally {
      setSpotApiLoading(false)
    }
  }

  const getSpot = async (
    idToken: string,
    user_uid: string,
    trip_token: string,
    spot_id: number
  ) => {
    setSpotApiLoading(true)
    try {
      const data: DbSpotData = await getSpotAPI(
        idToken,
        user_uid,
        trip_token,
        spot_id
      )
      return data
    } catch (e) {
      showToast('error', GET_SPOT_ERROR_MSG)
    } finally {
      setSpotApiLoading(false)
    }
  }

  const createSpot = async (
    idToken: string,
    user_uid: string,
    trip_token: string,
    options: CreateSpotOptions
  ) => {
    setSpotApiLoading(true)
    try {
      const data: DbSpotData = await createSpotAPI(
        idToken,
        user_uid,
        trip_token,
        options
      )
      setDbSpotsData([...(dbSpotsData || []), data])
      showToast('success', CREATE_SPOT_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', CREATE_SPOT_ERROR_MSG)
    } finally {
      setSpotApiLoading(false)
    }
  }

  const updateSpot = async (
    idToken: string,
    user_uid: string,
    trip_token: string,
    spot_id?: number,
    options?: UpdateSpotOptions,
    base_date?: string,
    date_offset?: string,
    hideToast?: boolean
  ) => {
    setSpotApiLoading(true)
    try {
      const data: DbSpotData | DbSpotData[] = await updateSpotAPI(
        idToken,
        user_uid,
        trip_token,
        spot_id,
        options,
        base_date,
        date_offset
      )

      let updatedSpotsData: DbSpotData[]

      if (dbSpotsData) {
        if (spot_id) {
          updatedSpotsData = dbSpotsData.map((spotData: DbSpotData) =>
            spotData.id === spot_id ? (data as DbSpotData) : spotData
          )
        } else {
          updatedSpotsData = data as DbSpotData[]
        }

        setDbSpotsData(updatedSpotsData)
      }
      !hideToast && showToast('success', UPDATE_SPOT_SUCCESS_MSG)
      return data
    } catch (e) {
      !hideToast && showToast('error', UPDATE_SPOT_ERROR_MSG)
    } finally {
      setSpotApiLoading(false)
    }
  }

  const deleteSpot = async (
    idToken: string,
    user_uid: string,
    trip_token: string,
    spot_id?: number,
    date?: string,
    hideToast?: boolean
  ) => {
    setSpotApiLoading(true)
    try {
      const statusCode: number = await deleteSpotAPI(
        idToken,
        user_uid,
        trip_token,
        spot_id,
        date
      )
      if (statusCode === HTTP_STATUS_NO_CONTENT) {
        if (dbSpotsData) {
          const deletedSpotsData = dbSpotsData.filter(
            (spotData: DbSpotData) => {
              if (spot_id) {
                return spotData.id !== spot_id
              } else if (date) {
                return spotData.date !== date
              }
            }
          )
          setDbSpotsData(deletedSpotsData)
        }
        !hideToast && showToast('success', DELETE_SPOT_SUCCESS_MSG)
        return true
      } else {
        !hideToast && showToast('error', DELETE_SPOT_ERROR_MSG)
        return false
      }
    } catch (e) {
      !hideToast && showToast('error', DELETE_SPOT_ERROR_MSG)
    } finally {
      setSpotApiLoading(false)
    }
  }

  return {
    getSpots,
    getSpot,
    createSpot,
    updateSpot,
    deleteSpot,
  }
}
