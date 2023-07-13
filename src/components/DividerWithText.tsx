import React from 'react'

type DividerWithTextProps = {
  text: string
}

export const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => {
  return (
    <>
      <div className="flex items-center justify-center m-4 h-5">
        <hr className="w-[25%] border-t-2 border-gray-200" />
        <p className="text-gray-700 mx-6 text-xs sm:text-sm">{text}</p>
        <hr className="w-[25%] border-t-2 border-gray-200" />
      </div>
    </>
  )
}
