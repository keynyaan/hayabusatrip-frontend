import React from 'react'
import Image from 'next/image'
import { useAuthContext } from '@/context/AuthContext'

type GoogleButtonProps = {
  text: string
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ text }) => {
  const { loginWithGoogle, googleLoginLoading } = useAuthContext()

  return (
    <button
      onClick={loginWithGoogle}
      className={`flex items-center justify-center w-full text-gray-700 rounded border-2 focus:outline-none focus:border-brand-color ${
        !googleLoginLoading
          ? 'hover:border-brand-color transition'
          : 'opacity-50 cursor-not-allowed'
      }`}
      disabled={googleLoginLoading}
    >
      <Image
        src="/images/google-logo.svg"
        alt="Google logo"
        width={40}
        height={40}
      />
      {text}
    </button>
  )
}
