import axios from 'axios'
import { updateTripAPI, DbTripData } from '@/api/tripApi'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import {
  FILE_SIZE_LIMIT_BYTES,
  FILE_SIZE_LIMIT_MB,
  TRIP_IMAGES_DIRECTORY,
  USER_ICONS_DIRECTORY,
  USERS_URL,
  UPLOAD_TRIP_IMAGE_ERROR_MSG,
  UPLOAD_TRIP_IMAGE_LOADING_MSG,
  UPLOAD_TRIP_IMAGE_SUCCESS_MSG,
  UPLOAD_USER_ICON_ERROR_MSG,
  UPLOAD_USER_ICON_LOADING_MSG,
  UPLOAD_USER_ICON_SUCCESS_MSG,
} from '@/utils/constants'
import { uploadImageToS3 } from '@/api/S3Api'
import { getTimestamp } from '@/utils/getTimestamp'
import { UpdateUserOptions } from '@/api/userApi'

export const useS3Api = () => {
  const { showToast } = useToast()
  const {
    currentUser,
    dbUserData,
    dbTripsData,
    selectedTrip,
    setS3ApiLoading,
    setDbTripsData,
    setUserIconPath,
  } = useAuthContext()

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', '画像ファイルを選択してください。')
      return false
    }

    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      showToast(
        'error',
        `画像ファイルのサイズは${FILE_SIZE_LIMIT_MB}MB以下にしてください。`
      )
      return false
    }

    return true
  }

  const uploadTripImage = async (file: File) => {
    if (!(currentUser && dbUserData && selectedTrip)) {
      showToast('error', 'ログインしてください。')
      return
    }

    if (!validateFile(file)) {
      return
    }

    const idToken = await currentUser.getIdToken()
    const filename = `${TRIP_IMAGES_DIRECTORY}/${currentUser.uid}/${
      selectedTrip.trip_token
    }-${getTimestamp()}.${file.type.split('/')[1]}`

    setS3ApiLoading(true)
    showToast('info', UPLOAD_TRIP_IMAGE_LOADING_MSG)

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
      showToast('success', UPLOAD_TRIP_IMAGE_SUCCESS_MSG)
      return data
    } catch (e) {
      showToast('error', UPLOAD_TRIP_IMAGE_ERROR_MSG)
    } finally {
      setS3ApiLoading(false)
    }
  }

  const uploadUserIconImage = async (file: File) => {
    if (!(currentUser && dbUserData)) {
      showToast('error', 'ログインしてください。')
      return
    }

    if (!validateFile(file)) {
      return
    }

    const params: { user: UpdateUserOptions } = {
      user: { uid: dbUserData.uid },
    }

    const idToken = await currentUser.getIdToken()
    const filename = `${USER_ICONS_DIRECTORY}/${
      currentUser.uid
    }-${getTimestamp()}.${file.type.split('/')[1]}`

    setS3ApiLoading(true)
    showToast('info', UPLOAD_USER_ICON_LOADING_MSG)

    try {
      const imageUrl = await uploadImageToS3(file, filename)
      params.user.icon_path = `${imageUrl}?v=${getTimestamp()}`
      const res = await axios.patch(`${USERS_URL}/${dbUserData.uid}`, params, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
      setUserIconPath(res.data.icon_path)
      showToast('success', UPLOAD_USER_ICON_SUCCESS_MSG)
      return res.data
    } catch (e) {
      showToast('error', UPLOAD_USER_ICON_ERROR_MSG)
    } finally {
      setS3ApiLoading(false)
    }
  }

  return {
    uploadTripImage,
    uploadUserIconImage,
  }
}
