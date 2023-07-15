import React, { FC } from 'react'

type TextareaFieldProps = {
  id: string
  labelName: string
  value: string
  srOnly?: boolean
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: () => void
  error?: string
  maxLength?: number
  rows?: number
  resizeNone?: boolean
  readOnly?: boolean
}

export const TextareaField: FC<TextareaFieldProps> = ({
  id,
  labelName,
  value,
  srOnly,
  placeholder,
  onChange,
  onBlur,
  error,
  maxLength,
  rows,
  resizeNone,
  readOnly,
}) => {
  return (
    <div className="relative">
      <label
        className={`text-sm sm:text-base text-gray-500 whitespace-nowrap ${
          srOnly ? 'sr-only' : ''
        }`}
        htmlFor={id}
      >
        {labelName}
      </label>
      <textarea
        className={`w-full px-3 py-2 text-gray-700 text-xs sm:text-sm bg-white border rounded focus:outline-none ${
          resizeNone ? 'resize-none' : ''
        } ${
          readOnly ? '' : error ? 'border-red-500' : 'focus:border-brand-color'
        }`}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
        rows={rows}
        readOnly={readOnly}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
