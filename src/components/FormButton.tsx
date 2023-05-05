import React from 'react'
import { ClipLoader } from 'react-spinners'
import { useAuthContext } from '@/context/AuthContext'

type FormButtonProps = {
  label: string
  isFormValid: boolean
  isUnsubscribe?: boolean
}

const spinner = <ClipLoader size={24} color="white" />

export const FormButton: React.FC<FormButtonProps> = ({
  label,
  isFormValid,
  isUnsubscribe,
}) => {
  const { loading, googleLoading } = useAuthContext()

  return (
    <button
      className={`flex justify-center w-full py-2 text-white rounded focus:outline-none ${
        isUnsubscribe
          ? 'bg-red-500 focus:border-red-500'
          : 'bg-brand-color focus:border-brand-color'
      } ${
        isFormValid && !loading && !googleLoading
          ? 'hover:bg-opacity-80 transition-all'
          : 'opacity-50 cursor-not-allowed'
      }`}
      type="submit"
      disabled={!isFormValid || loading || googleLoading}
    >
      {loading ? spinner : label}
    </button>
  )
}
