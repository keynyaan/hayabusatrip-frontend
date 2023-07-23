import React, { FC, useRef } from 'react'
import 'react-responsive-modal/styles.css'
import Select from 'react-select'
import type { SelectInstance } from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export type OptionType = {
  value: string
  label: string
  icon: IconDefinition
  color: string
}

type SelectWithIconFieldProps = {
  id: string
  labelName: string
  options: OptionType[]
  value: OptionType
  onChange: (selectedOption: OptionType | null) => void
}

export const SelectWithIconField: FC<SelectWithIconFieldProps> = ({
  id,
  labelName,
  options,
  value,
  onChange,
}) => {
  const selectRef = useRef<SelectInstance<OptionType> | null>(null)

  const formatOptionLabel = (option: OptionType) => (
    <div className="flex items-center space-x-2 h-10">
      <div
        className={`rounded-full w-8 h-8 flex items-center justify-center ${option.color}`}
      >
        <FontAwesomeIcon icon={option.icon} className="text-white" />
      </div>
      <p className="text-sm sm:text-base">{option.label}</p>
    </div>
  )

  const focusSelect = () => {
    selectRef.current?.focus()
  }

  return (
    <div>
      <label
        className="text-sm sm:text-base text-gray-500"
        htmlFor={id}
        onClick={focusSelect}
      >
        {labelName}
      </label>
      <Select
        ref={selectRef}
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        formatOptionLabel={formatOptionLabel}
        isSearchable={false}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#00aab9' : '#e6e7eb',
            cursor: 'pointer',
            boxShadow: 'none',
            '&:hover': {
              borderColor: state.isFocused ? '#00aab9' : '#e6e7eb',
            },
          }),
          valueContainer: (base) => ({
            ...base,
            padding: '0px 12px',
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: '#515a68',
            transform: 'scale(0.7)',
            '&:hover': {
              color: '#515a68',
            },
          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: 'none',
          }),
          option: (base, state) => ({
            ...base,
            color: state.isSelected ? base.color : '#374151',
            padding: '0px 12px',
          }),
          singleValue: (base) => ({
            ...base,
            color: '#374151',
            margin: '0px',
          }),
        }}
      />
    </div>
  )
}
