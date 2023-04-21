import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { DividerWithText } from '@/components/DividerWithText'
import GoogleButton from '@/components/GoogleButton'
import { InputField } from '@/components/InputField'
import { ModalButton } from '@/components/ModalButton'
import { SwitchFormLink } from '@/components/SwitchFormLink'
import { useSignUpForm } from '@/hooks/useSignUpForm'
import { FORM_SIGN_UP, FORM_PASSWORD_RESET } from '@/utils/constants'

type LoginFormProps = {
  setForm: (formName: string) => void
}

export const LoginForm: FC<LoginFormProps> = ({ setForm }) => {
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
  } = useSignUpForm()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ここでフォームの送信処理を行います。
  }

  return (
    <>
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
        <InputField
          id="password"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          error={passwordError}
        />
        <ModalButton isFormValid={isLoginFormValid} label="ログインする" />
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
