import React from 'react'

type SwitchFormLinkProps = {
  text: string
  formName: string
  onClick: (formName: string) => void
}

export const SwitchFormLink: React.FC<SwitchFormLinkProps> = ({
  text,
  formName,
  onClick,
}) => {
  const handleClick = () => {
    onClick(formName)
  }

  return (
    <p className="text-sm sm:text-base text-gray-700 mt-4 text-center">
      {text}
      <button
        onClick={handleClick}
        className="text-brand-color hover:underline"
      >
        こちら
      </button>
    </p>
  )
}
