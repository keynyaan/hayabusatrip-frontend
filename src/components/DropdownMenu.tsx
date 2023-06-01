import React, { ReactNode } from 'react'

type DropdownMenuProps = {
  isVisible: boolean
  children: ReactNode
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isVisible,
  children,
}) => {
  return isVisible ? (
    <div className="absolute z-15 bg-white text-gray-700 rounded shadow right-0 mt-2 flex flex-col">
      {React.Children.map(children, (child) => child)}
    </div>
  ) : null
}
