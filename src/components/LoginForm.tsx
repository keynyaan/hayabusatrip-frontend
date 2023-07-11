import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { DividerWithText } from '@/components/DividerWithText'
import { FormButton } from '@/components/FormButton'
import { GoogleButton } from '@/components/GoogleButton'
import { InputField } from '@/components/InputField'
import { SwitchFormLink } from '@/components/SwitchFormLink'
import { useAuthContext } from '@/context/AuthContext'
import { useForm } from '@/hooks/useForm'
import {
  FORM_SIGN_UP,
  FORM_PASSWORD_RESET,
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '@/utils/constants'

type LoginFormProps = {
  setForm: (formName: string) => void
  onClose: () => void
}

export const LoginForm: FC<LoginFormProps> = ({ setForm, onClose }) => {
  const { loginLoading, loginWithEmailAndPassword } = useAuthContext()

  const loginFunc = async (email: string, password: string) => {
    const user = await loginWithEmailAndPassword(email, password)
    if (user) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoginFormValid) {
      loginFunc(email, password)
    }
  }

  const {
    email,
    password,
    emailError,
    passwordError,
    isLoginFormValid,
    handleEmailChange,
    handlePasswordChange,
    handleEmailBlur,
    handlePasswordBlur,
  } = useForm()

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="email"
          type="email"
          labelName="メールアドレス"
          srOnly={true}
          placeholder="メールアドレス"
          maxLength={MAX_EMAIL_LENGTH}
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          error={emailError}
        />
        <InputField
          id="password"
          type="password"
          labelName="パスワード"
          srOnly={true}
          placeholder="パスワード"
          maxLength={MAX_PASSWORD_LENGTH}
          value={password}
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          error={passwordError}
        />
        <FormButton
          label="ログイン"
          isFormValid={isLoginFormValid}
          loading={loginLoading}
        />
      </form>

      <SwitchFormLink
        text="パスワードをお忘れの方は"
        formName={FORM_PASSWORD_RESET}
        onClick={setForm}
      />

      <DividerWithText text="または" />

      <GoogleButton text="Googleでログイン" />
      <SwitchFormLink
        text="新規登録の方は"
        formName={FORM_SIGN_UP}
        onClick={setForm}
      />
    </>
  )
}
