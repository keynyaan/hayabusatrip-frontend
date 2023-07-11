import React, { ReactNode } from 'react'

type DropdownMenuProps = {
  isVisible: boolean
  children: ReactNode
  isTop0?: boolean
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isVisible,
  children,
  isTop0,
}) => {
  return isVisible ? (
    <div
      className={`absolute z-15 bg-white text-gray-700 rounded shadow right-0 mt-2 flex flex-col ${
        isTop0 ? 'top-0' : ''
      }`}
    >
      {React.Children.map(children, (child) => child)}
    </div>
  ) : null
}
