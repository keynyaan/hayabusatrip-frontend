import React, { FC, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '@/context/ToastContext'
import {
  HANDLE_COPY_SUCCESS_MSG,
  HANDLE_COPY_ERROR_MSG,
} from '@/utils/constants'

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
  onFocus?: () => void
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
  isFocus?: boolean
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
  onFocus,
  error,
  readonly,
  disabled,
  onCopy,
  isTripDate,
  inputmode,
  pattern,
  fullClickableDate,
  tabIndex,
  isFocus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => showToast('success', HANDLE_COPY_SUCCESS_MSG))
        .catch(() => showToast('error', HANDLE_COPY_ERROR_MSG))
    }
  }
  useEffect(() => {
    if (isFocus) {
      inputRef.current?.focus()
    }
  }, [isFocus])

  return (
    <div className={`relative ${isTripDate ? 'flex items-center' : ''}`}>
      <label
        className={`text-sm sm:text-base text-gray-500 whitespace-nowrap ${
          srOnly ? 'sr-only' : ''
        } ${isTripDate ? 'w-12' : ''}`}
        htmlFor={id}
      >
        {labelName}
      </label>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          className={`text-sm sm:text-base h-10 px-3 py-2 text-gray-700 border rounded focus:outline-none ${
            error ? 'border-red-500' : 'focus:border-brand-color'
          } ${onCopy ? 'pr-8' : ''} ${
            fullClickableDate ? 'full-clickable-date' : ''
          } ${isTripDate ? 'w-32' : 'w-full'}`}
          type={type}
          min={min}
          max={max}
          id={id}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          readOnly={readonly}
          disabled={disabled}
          inputMode={inputmode}
          pattern={pattern}
          tabIndex={tabIndex}
        />
        {onCopy && (
          <button
            onClick={handleCopy}
            className="text-sm sm:text-base absolute right-2 text-gray-500 hover:text-gray-400 transition"
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
