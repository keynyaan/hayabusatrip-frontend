import React from 'react'
import { ClipLoader } from 'react-spinners'
import { useAuthContext } from '@/context/AuthContext'

type FormButtonProps = {
  label: string
  isFormValid: boolean
  isUpdateUser?: boolean
  isPasswordReset?: boolean
  isUnsubscribe?: boolean
  isTripApi?: boolean
}

const spinner = <ClipLoader size={24} color="white" />

export const FormButton: React.FC<FormButtonProps> = ({
  label,
  isFormValid,
  isUpdateUser,
  isPasswordReset,
  isUnsubscribe,
  isTripApi,
}) => {
  const {
    updateUserLoading,
    resetPasswordLoading,
    deleteUserLoading,
    anyLoading,
    tripApiLoading,
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
          ? 'hover:bg-opacity-80 transition-all'
          : 'opacity-50 cursor-not-allowed'
      }`}
      type="submit"
      disabled={!isFormValid || loading}
    >
      {loading ? spinner : label}
    </button>
  )
}
