import React, { FC } from 'react'

type SelectFieldProps = {
  id: string
  labelName: string
  srOnly?: boolean
  value: string
  items: { value: string; name: string }[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const SelectField: FC<SelectFieldProps> = ({
  id,
  labelName,
  srOnly,
  value,
  items,
  onChange,
}) => (
  <div>
    <label className={`text-gray-500 ${srOnly ? 'sr-only' : ''}`} htmlFor={id}>
      {labelName}
    </label>
    <select
      className="w-full pl-3 py-2 text-gray-700 border rounded focus:outline-none focus:border-brand-color"
      style={{
        borderRightWidth: '13px',
      }}
      id={id}
      value={value}
      onChange={onChange}
    >
      <option value="" disabled>
        {labelName}を選択してください
      </option>
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.name}
        </option>
      ))}
    </select>
  </div>
)
