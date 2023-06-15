import { updateTripAPI, DbTripData } from '@/api/tripApi'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import {
  UPLOAD_LOADING_MSG,
  UPLOAD_SUCCESS_MSG,
  UPLOAD_ERROR_MSG,
  FILE_SIZE_LIMIT_BYTES,
  FILE_SIZE_LIMIT_MB,
  TRIP_IMAGES_DIRECTORY,
} from '@/utils/constants'
import { uploadImageToS3 } from '@/api/S3Api'
import { getTimestamp } from '@/utils/getTimestamp'

export const useS3Api = () => {
  const { showToast } = useToast()
  const {
    currentUser,
    dbUserData,
    dbTripsData,
    selectedTrip,
    setS3ApiLoading,
    setDbTripsData,
  } = useAuthContext()

  const uploadTripImage = async (file: File) => {
    if (!(currentUser && dbUserData && selectedTrip)) {
      showToast('error', 'ログインしてください。')
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast('error', '画像ファイルを選択してください。')
      return
    }

    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      showToast(
        'error',
        `画像ファイルのサイズは${FILE_SIZE_LIMIT_MB}MB以下にしてください。`
      )
      return
    }

    const idToken = await currentUser.getIdToken()
    const filename = `${TRIP_IMAGES_DIRECTORY}/${currentUser.uid}/${
      selectedTrip.trip_token
    }-${getTimestamp()}.${file.type.split('/')[1]}`

    setS3ApiLoading(true)
    showToast('info', UPLOAD_LOADING_MSG)

    try {
      const imageUrl = await uploadImageToS3(file, filename)
      const data: DbTripData = await updateTripAPI(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        {
          image_path: `${imageUrl}?v=${getTimestamp()}`,
        }
      )

      if (dbTripsData) {
        const updatedTripsData = dbTripsData.map((tripData: DbTripData) =>
          tripData.trip_token === selectedTrip.trip_token ? data : tripData
        )
        setDbTripsData(updatedTripsData)
      }
      showToast('success', UPLOAD_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', UPLOAD_ERROR_MSG)
    } finally {
      setS3ApiLoading(false)
    }
  }

  return {
    uploadTripImage,
  }
}
