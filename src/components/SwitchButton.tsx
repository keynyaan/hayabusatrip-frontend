import React, { FC } from 'react'
import ReactSwitch from 'react-switch'

type SwitchButtonProps = {
  label: string
  checked: boolean
  onChange: () => void
}

export const SwitchButton: FC<SwitchButtonProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <label htmlFor="react-switch" className="text-gray-700">
        {label}
      </label>
      <ReactSwitch
        id="react-switch"
        checked={checked}
        onChange={onChange}
        onColor="#00aab9"
        handleDiameter={26}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
        height={24}
        width={48}
      />
    </div>
  )
}
