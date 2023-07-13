import React from 'react'
import { Spinner } from '@/components/Spinner'

type FormButtonProps = {
  label: string
  isFormValid: boolean
  loading: boolean
  isRedStyle?: boolean
  onClick?: () => void
}

export const FormButton: React.FC<FormButtonProps> = ({
  label,
  isFormValid,
  loading,
  isRedStyle,
  onClick,
}) => {
  return (
    <button
      className={`text-sm sm:text-base h-10 flex justify-center items-center w-full py-2 text-white rounded focus:outline-none ${
        isRedStyle
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
