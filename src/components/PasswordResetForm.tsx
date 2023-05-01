import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { InputField } from '@/components/InputField'
import { ModalButton } from '@/components/ModalButton'
import { useSignUpForm } from '@/hooks/useSignUpForm'
import { useAuthContext } from '@/context/AuthContext'

type PasswordResetFormProps = {
  onClose: () => void
}

export const PasswordResetForm: FC<PasswordResetFormProps> = ({ onClose }) => {
  const { resetPassword } = useAuthContext()

  const loginFunc = async (email: string) => {
    const success = await resetPassword(email)
    if (success) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isPasswordResetFormValid) {
      loginFunc(email)
    }
  }

  const {
    email,
    emailError,
    isPasswordResetFormValid,
    handleEmailChange,
    handleEmailBlur,
  } = useSignUpForm()

  return (
    <>
      <p className=" text-gray-700 mb-4">
        ご登録いただいたメールアドレスを入力してください。
        <br />
        パスワード再設定のURLが記載されたメールを送信します。
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="email"
          type="email"
          placeholder="メールアドレス"
          maxLength={254}
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          error={emailError}
        />
        <ModalButton
          label="パスワード再設定メールを送信"
          isFormValid={isPasswordResetFormValid}
        />
      </form>
    </>
  )
}
