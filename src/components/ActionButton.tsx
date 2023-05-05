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
  const textColor = isUnsubscribe ? 'red-500' : 'brand-color'

  return (
    <button
      className={`px-4 py-2 text-sm text-${textColor} border border-${textColor} rounded hover:bg-${textColor} hover:text-white transition-all`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
