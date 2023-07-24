import React, { FC, forwardRef, ButtonHTMLAttributes, useRef } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import ja from 'date-fns/locale/ja'
import 'react-datepicker/dist/react-datepicker.css'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

registerLocale('ja', ja)

type DatePickerProps = {
  id: string
  min: Date
  max: Date
  labelName: string
  value: Date
  onChange: (date: Date) => void
}

type CustomInputProps = {
  value?: string
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick }, ref) => (
    <button
      className="flex items-center justify-between text-transparent bg-white text-sm sm:text-base h-10 px-3 py-2 border rounded focus:outline-none focus:border-brand-color w-32 cursor-pointer relative group space-x-2"
      onClick={onClick}
      ref={ref}
      style={{ textShadow: '0 0 0 rgb(55 65 81)' }}
    >
      {value}
      <FontAwesomeIcon
        icon={faCalendar}
        className="text-sm sm:text-base text-black transition absolute top-1/2 right-4 transform -translate-y-1/2 group-hover:opacity-50 cursor-pointer"
      />
    </button>
  )
)

CustomInput.displayName = 'CustomInput'

export const CustomDate: FC<DatePickerProps> = ({
  id,
  min,
  max,
  labelName,
  value,
  onChange,
}) => {
  const ref = useRef<DatePicker>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      ref.current?.setOpen(false)
    }
  }

  return (
    <div className="flex items-center space-x-1" onKeyDown={handleKeyDown}>
      <label
        className="text-sm sm:text-base text-gray-500 whitespace-nowrap"
        htmlFor={id}
      >
        {labelName}
      </label>
      <div className="relative w-32">
        <DatePicker
          ref={ref}
          customInput={<CustomInput />}
          dateFormat="MM/dd(eee)"
          id={id}
          selected={value}
          onChange={onChange}
          minDate={min}
          maxDate={max}
          locale="ja"
          renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
            <div className="flex justify-between items-center mx-4">
              <button
                onClick={decreaseMonth}
                className="hover:opacity-50 transition text-lg"
              >
                {'<'}
              </button>
              <div className="font-bold">
                {date.getFullYear()}年{date.getMonth() + 1}月
              </div>
              <button
                onClick={increaseMonth}
                className="hover:opacity-50 transition text-lg"
              >
                {'>'}
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}
