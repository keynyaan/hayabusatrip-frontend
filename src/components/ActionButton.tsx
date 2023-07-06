import React, { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faPlus } from '@fortawesome/free-solid-svg-icons'

type ActionButtonProps = {
  text: string
  onClick?: () => void
  isUnsubscribe?: boolean
  showHomeIcon?: boolean
  showPlusIcon?: boolean
  isWfull?: boolean
}

export const ActionButton: FC<ActionButtonProps> = ({
  text,
  onClick,
  isUnsubscribe,
  showHomeIcon,
  showPlusIcon,
  isWfull,
}) => {
  return (
    <button
      className={`px-4 py-2 text-sm border rounded hover:text-white transition-all ${
        isWfull ? 'w-full' : ''
      } ${
        isUnsubscribe
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
