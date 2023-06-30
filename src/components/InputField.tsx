import React, { FC, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '@/context/ToastContext'

type InputFieldProps = {
  id: string
  type: string
  labelName: string
  value: string | number
  min?: string
  max?: string
  srOnly?: boolean
  placeholder?: string
  maxLength?: number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  error?: string
  readonly?: boolean
  disabled?: boolean
  onCopy?: boolean
  isTripDate?: boolean
  inputmode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
  pattern?: string
  fullClickableDate?: boolean
  tabIndex?: number
}

export const InputField: FC<InputFieldProps> = ({
  id,
  type,
  labelName,
  value,
  min,
  max,
  srOnly,
  placeholder,
  maxLength,
  onChange,
  onBlur,
  error,
  readonly,
  disabled,
  onCopy,
  isTripDate,
  inputmode,
  pattern,
  fullClickableDate,
  tabIndex,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => showToast('success', 'URLをコピーしました'))
        .catch(() => showToast('error', 'コピーに失敗しました'))
    }
  }

  return (
    <div className={`relative ${isTripDate ? 'flex items-center' : ''}`}>
      <label
        className={`text-gray-500 whitespace-nowrap ${
          srOnly ? 'sr-only' : ''
        } ${isTripDate ? 'w-20' : ''}`}
        htmlFor={id}
      >
        {labelName}
      </label>
      <input
        ref={inputRef}
        className={`w-full px-3 py-2 text-gray-700 border rounded focus:outline-none ${
          error ? 'border-red-500' : 'focus:border-brand-color'
        } ${onCopy ? 'pr-8' : ''} ${
          fullClickableDate ? 'full-clickable-date' : ''
        }`}
        type={type}
        min={min}
        max={max}
        id={id}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readonly}
        disabled={disabled}
        inputMode={inputmode}
        pattern={pattern}
        tabIndex={tabIndex}
      />
      {onCopy && (
        <button
          onClick={handleCopy}
          className="absolute right-2 top-1/2 text-gray-500 hover:text-gray-400 transition"
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
