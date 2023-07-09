import React, { FC, useRef } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'
import { useS3Api } from '@/hooks/useS3Api'
import { FILE_SIZE_LIMIT_MB } from '@/utils/constants'

type TripPhotoFormProps = {
  onClose: () => void
}

export const TripPhotoForm: FC<TripPhotoFormProps> = ({ onClose }) => {
  const { selectedTrip, S3ApiLoading, setSelectedTrip } = useAuthContext()
  const { uploadTripImage } = useS3Api()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleClickButton = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) {
      return
    }

    const imageFile = event.target.files[0]
    const success = await uploadTripImage(imageFile)

    if (success) {
      onClose()
      setSelectedTrip(success)
    }
  }

  return (
    <>
      {selectedTrip && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            {FILE_SIZE_LIMIT_MB}MB以下の画像ファイルをアップロードしてください。
          </p>
          <FormButton
            label="アップロード"
            isFormValid={true}
            loading={S3ApiLoading}
            onClick={handleClickButton}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </>
  )
}
