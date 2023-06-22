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
  readonly?: boolean
  maxLength?: number
  rows?: number
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
  readonly,
  maxLength,
  rows,
}) => {
  return (
    <div className="relative">
      <label
        className={`text-gray-500 whitespace-nowrap ${srOnly ? 'sr-only' : ''}`}
        htmlFor={id}
      >
        {labelName}
      </label>
      <textarea
        className={`w-full px-3 py-2 text-gray-700 text-sm border rounded focus:outline-none resize-none ${
          error ? 'border-red-500' : 'focus:border-brand-color'
        }`}
        id={id}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readonly}
        rows={rows}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
