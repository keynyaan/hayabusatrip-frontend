import React from 'react'

type ModalButtonProps = {
  isFormValid: boolean
  label: string
}

export const ModalButton: React.FC<ModalButtonProps> = ({
  isFormValid,
  label,
}) => {
  return (
    <button
      className={`w-full py-2 bg-brand-color text-white rounded focus:outline-none focus:border-brand-color ${
        isFormValid
          ? 'hover:bg-opacity-80 transition-all '
          : 'opacity-50 cursor-not-allowed'
      }`}
      type="submit"
      disabled={!isFormValid}
    >
      {label}
    </button>
  )
}
