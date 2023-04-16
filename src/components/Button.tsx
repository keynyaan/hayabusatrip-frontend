import React from 'react'
import Link from 'next/link'

type ButtonProps = {
  to: string
  label: string
  className?: string
}

export const Button: React.FC<ButtonProps> = ({ to, label, className }) => {
  const classes = `transition-all rounded px-4 py-1 ${className || ''}`
  return (
    <Link href={to}>
      <button className={classes}>{label}</button>
    </Link>
  )
}
