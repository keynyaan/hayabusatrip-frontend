import React, { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

type SelectFieldProps = {
  id: string
  labelName: string
  srOnly?: boolean
  value?: string
  items: { value: string; name: string }[] | number[]
  search?: boolean
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const SelectField: FC<SelectFieldProps> = ({
  id,
  labelName,
  srOnly,
  value,
  items,
  search,
  onChange,
}) => (
  <div>
    <label
      className={`text-sm sm:text-base text-gray-500 ${
        srOnly ? 'sr-only' : ''
      }`}
      htmlFor={id}
    >
      {search && (
        <FontAwesomeIcon
          icon={faSearch}
          className="text-sm sm:text-base mr-2 text-gray-700"
        />
      )}
      {labelName}
    </label>
    <select
      className="text-sm sm:text-base h-10 w-full pl-3 py-2 text-gray-700 border rounded focus:outline-none focus:border-brand-color"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
    >
      <option value="" disabled={!search}>
        {search ? 'すべて' : `${labelName}を選択してください`}
      </option>
      {items.map((item, index) => {
        if (typeof item === 'number') {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          )
        } else {
          return (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          )
        }
      })}
    </select>
  </div>
)
