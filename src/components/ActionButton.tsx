import React, { FC } from 'react'
import classNames from 'classnames'

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

  const buttonClasses = classNames(
    'px-4',
    'py-2',
    'text-sm',
    `text-${textColor}`,
    `border`,
    `border-${textColor}`,
    'rounded',
    `hover:bg-${textColor}`,
    'hover:text-white',
    'transition-all'
  )

  return (
    <button className={buttonClasses} onClick={onClick}>
      {text}
    </button>
  )
}
