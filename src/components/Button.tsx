import React from 'react'

type ButtonProps = {
  onClick: () => void
  label: string
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
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
