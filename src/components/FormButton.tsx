import React from 'react'
import { Spinner } from '@/components/Spinner'
import { useAuthContext } from '@/context/AuthContext'

type FormButtonProps = {
  label: string
  isFormValid: boolean
  isUpdateUser?: boolean
  isPasswordReset?: boolean
  isUnsubscribe?: boolean
  isTripApi?: boolean
  isSpotApi?: boolean
  isS3Api?: boolean
  onClick?: () => void
}

export const FormButton: React.FC<FormButtonProps> = ({
  label,
  isFormValid,
  isUpdateUser,
  isPasswordReset,
  isUnsubscribe,
  isTripApi,
  isSpotApi,
  isS3Api,
  onClick,
}) => {
  const {
    updateUserLoading,
    resetPasswordLoading,
    deleteUserLoading,
    anyLoading,
    tripApiLoading,
    spotApiLoading,
    S3ApiLoading,
  } = useAuthContext()

  let loading = false

  if (isUpdateUser) {
    loading = updateUserLoading
  } else if (isPasswordReset) {
    loading = resetPasswordLoading
  } else if (isUnsubscribe) {
    loading = deleteUserLoading
  } else if (isTripApi) {
    loading = tripApiLoading
  } else if (isSpotApi) {
    loading = spotApiLoading
  } else if (isS3Api) {
    loading = S3ApiLoading
  } else {
    loading = anyLoading
  }

  return (
    <button
      className={`flex justify-center w-full py-2 text-white rounded focus:outline-none ${
        isUnsubscribe
          ? 'bg-red-500 focus:border-red-500'
          : 'bg-brand-color focus:border-brand-color'
      } ${
        isFormValid && !loading
          ? 'hover:bg-opacity-80 transition'
          : 'opacity-50 cursor-not-allowed'
      }`}
      type="submit"
      disabled={!isFormValid || loading}
      onClick={onClick}
    >
      {loading ? <Spinner isFormButton={true} /> : label}
    </button>
  )
}
