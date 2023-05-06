import React, { FC } from 'react'

type ActionButtonProps = {
  text: string
  onClick: () => void
  isUnsubscribe?: boolean
}

export const ActionButton: FC<ActionButtonProps> = ({
  text,
  onClick,
  isUnsubscribe = false,
}) => {
  return (
    <button
      className={`px-4 py-2 text-sm border rounded hover:text-white transition-all ${
        isUnsubscribe
          ? 'text-red-500 border-red-500 hover:bg-red-500'
          : 'text-brand-color border-brand-color hover:bg-brand-color'
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
