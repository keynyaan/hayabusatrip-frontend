import React from 'react'
import Image from 'next/image'
import { useAuthContext } from '@/context/AuthContext'

type GoogleButtonProps = {
  text: string
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ text }) => {
  const { loginWithGoogle, googleLoading } = useAuthContext()

  return (
    <button
      onClick={loginWithGoogle}
      className={`flex items-center justify-center w-full py-1 text-gray-700 rounded border-2 focus:outline-none focus:border-brand-color ${
        !googleLoading
          ? 'hover:border-brand-color transition-all'
          : 'opacity-50 cursor-not-allowed'
      }`}
      disabled={googleLoading}
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
