import React, { FC } from 'react'

type InputFieldProps = {
  id: string
  type: string
  labelName: string
  srOnly?: boolean
  placeholder?: string
  maxLength?: number
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  error: string
}

export const InputField: FC<InputFieldProps> = ({
  id,
  type,
  labelName,
  srOnly,
  placeholder,
  maxLength,
  value,
  onChange,
  onBlur,
  error,
}) => (
  <div>
    <label className={`text-gray-500 ${srOnly ? 'sr-only' : ''}`} htmlFor={id}>
      {labelName}
    </label>
    <input
      className={`w-full px-3 py-2 text-gray-700 border rounded focus:outline-none ${
        error ? 'border-red-500' : 'focus:border-brand-color'
      }`}
      type={type}
      id={id}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
    {error && <p className="text-red-500">{error}</p>}
  </div>
)
