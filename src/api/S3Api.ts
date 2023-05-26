import axios from 'axios'
import { UPLOAD_ERROR_MSG, S3_UPLOAD_URL } from '@/utils/constants'

export const uploadImageToS3 = async (file: File, filename: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('filename', filename)

  try {
    const result = await axios.post(S3_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return result.data.location
  } catch (e) {
    throw new Error(UPLOAD_ERROR_MSG)
  }
}
