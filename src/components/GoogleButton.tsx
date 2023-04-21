import React from 'react'
import Image from 'next/image'

type GoogleButtonProps = {
  text: string
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ text }) => {
  return (
    <button
      // onClick=
      className="flex items-center justify-center w-full py-1 text-gray-700 rounded border-2 focus:outline-none focus:border-brand-color hover:border-brand-color transition-all"
    >
      <Image
        src="/images/google_logo.svg"
        alt="Google logo"
        width={40}
        height={40}
      />
      {text}
    </button>
  )
}

export default GoogleButton
