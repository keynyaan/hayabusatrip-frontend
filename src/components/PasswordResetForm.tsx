import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { InputField } from '@/components/InputField'
import { FormButton } from '@/components/FormButton'
import { useForm } from '@/hooks/useForm'
import { useAuthContext } from '@/context/AuthContext'

type PasswordResetFormProps = {
  onClose: () => void
  login?: boolean
}

export const PasswordResetForm: FC<PasswordResetFormProps> = ({
  onClose,
  login,
}) => {
  const { currentUser, resetPassword } = useAuthContext()

  const currentUserEmail = currentUser?.email || ''
  const isCurrentUserEmailValid = Boolean(currentUserEmail)

  const resetPasswordFunc = async (email: string) => {
    const success = await resetPassword(login ? currentUserEmail : email)
    if (success) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    resetPasswordFunc(email)
  }

  const {
    email,
    emailError,
    isPasswordResetFormValid,
    handleEmailChange,
    handleEmailBlur,
  } = useForm()

  const isFormValid = login ? isCurrentUserEmailValid : isPasswordResetFormValid

  return (
    <>
      <p className=" text-gray-700 mb-4">
        ご登録いただいたメールアドレス
        {login ? 'を宛先にして、' : 'を入力してください。'}
        <br />
        パスワード再設定のURLが記載されたメールを送信します。
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {!login && (
          <InputField
            id="email"
            type="email"
            labelName="メールアドレス"
            srOnly={true}
            placeholder="メールアドレス"
            maxLength={254}
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={emailError}
          />
        )}
        <FormButton
          label="パスワード再設定メールを送信"
          isFormValid={isFormValid}
          isPasswordReset={true}
        />
      </form>
    </>
  )
}
