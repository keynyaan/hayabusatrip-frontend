import React from 'react'

type PrimaryButtonProps = {
  onClick: () => void
  label: string
  className?: string
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  label,
  className,
}) => {
  const classes = `transition rounded px-4 py-1 ${className || ''}`
  return (
    <button onClick={onClick} className={classes}>
      {label}
    </button>
  )
}
