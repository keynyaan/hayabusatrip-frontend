import React, { FC, useState } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from '@/components/Modal'
import { SignUpForm } from '@/components/SignUpForm'
import { LoginForm } from '@/components/LoginForm'
import { PasswordResetForm } from '@/components/PasswordResetForm'
import {
  FORM_SIGN_UP,
  FORM_LOGIN,
  FORM_PASSWORD_RESET,
} from '@/utils/constants'

type AuthModalProps = {
  open: boolean
  onClose: () => void
  form: string
}

export const AuthModal: FC<AuthModalProps> = ({ open, onClose, form }) => {
  const [activeForm, setActiveForm] = useState(form)

  return (
    <Modal open={open} onClose={onClose} title={activeForm}>
      {activeForm === FORM_SIGN_UP && <SignUpForm setForm={setActiveForm} />}
      {activeForm === FORM_LOGIN && (
        <LoginForm setForm={setActiveForm} onClose={onClose} />
      )}
      {activeForm === FORM_PASSWORD_RESET && (
        <PasswordResetForm setForm={setActiveForm} />
      )}
    </Modal>
  )
}
