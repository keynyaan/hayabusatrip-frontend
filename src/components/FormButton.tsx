import React from 'react'
import { ClipLoader } from 'react-spinners'
import { useAuthContext } from '@/context/AuthContext'

type FormButtonProps = {
  label: string
  isFormValid: boolean
}

const spinner = <ClipLoader size={24} color="white" />

export const FormButton: React.FC<FormButtonProps> = ({
  label,
  isFormValid,
}) => {
  const { loading, googleLoading } = useAuthContext()

  return (
    <button
      className={`flex justify-center w-full py-2 bg-brand-color text-white rounded focus:outline-none focus:border-brand-color ${
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
