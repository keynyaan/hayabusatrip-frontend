import React, { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faPlus } from '@fortawesome/free-solid-svg-icons'

type SecondaryButtonProps = {
  text: string
  onClick?: () => void
  isRedStyle?: boolean
  showHomeIcon?: boolean
  showPlusIcon?: boolean
  isWfull?: boolean
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  text,
  onClick,
  isRedStyle,
  showHomeIcon,
  showPlusIcon,
  isWfull,
}) => {
  return (
    <button
      className={`h-10 px-4 py-2 text-xs sm:text-sm border rounded hover:text-white transition bg-white ${
        isWfull ? 'w-full' : ''
      } ${
        isRedStyle
          ? 'text-red-500 border-red-500 hover:bg-red-500'
          : 'text-brand-color border-brand-color hover:bg-brand-color'
      }`}
      onClick={onClick}
    >
      {showHomeIcon && <FontAwesomeIcon icon={faHouse} className="mr-2" />}
      {showPlusIcon && <FontAwesomeIcon icon={faPlus} className="mr-2" />}
      {text}
    </button>
  )
}
