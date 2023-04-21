import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { AuthModal } from '@/components/AuthModal'
import { FORM_LOGIN, FORM_SIGN_UP } from '@/utils/constants'

export const AuthButtons: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signUpModalOpen, setSignUpModalOpen] = useState(false)

  const onOpenLoginModal = () => {
    setLoginModalOpen(true)
  }
  const onOpenSignUpModal = () => {
    setSignUpModalOpen(true)
  }

  const onCloseLoginModal = () => {
    setLoginModalOpen(false)
  }
  const onCloseSignUpModal = () => {
    setSignUpModalOpen(false)
  }

  return (
    <div className="space-x-4">
      <Button
        onClick={onOpenLoginModal}
        label={FORM_LOGIN}
        className="text-brand-color hover:bg-brand-color hover:bg-opacity-20"
      />
      {loginModalOpen && (
        <AuthModal
          open={loginModalOpen}
          onClose={onCloseLoginModal}
          form={FORM_LOGIN}
        />
      )}
      <Button
        onClick={onOpenSignUpModal}
        label={FORM_SIGN_UP}
        className="bg-brand-color text-white hover:bg-opacity-80"
      />
      {signUpModalOpen && (
        <AuthModal
          open={signUpModalOpen}
          onClose={onCloseSignUpModal}
          form={FORM_SIGN_UP}
        />
      )}
    </div>
  )
}
