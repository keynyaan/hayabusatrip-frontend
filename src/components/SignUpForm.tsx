import Link from 'next/link'
import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { DividerWithText } from '@/components/DividerWithText'
import GoogleButton from '@/components/GoogleButton'
import { InputField } from '@/components/InputField'
import { FormButton } from '@/components/FormButton'
import { SwitchFormLink } from '@/components/SwitchFormLink'
import { useAuthContext } from '@/context/AuthContext'
import { useForm } from '@/hooks/useForm'
import {
  FORM_LOGIN,
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
} from '@/utils/constants'

type SignUpFormProps = {
  setForm: (formName: string) => void
  onClose: () => void
}

export const SignUpForm: FC<SignUpFormProps> = ({ setForm, onClose }) => {
  const { signup, signupLoading } = useAuthContext()

  const signUpFunc = async (
    email: string,
    password: string,
    username: string
  ) => {
    const user = await signup(email, password, username)
    if (user) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSignUpFormValid) {
      signUpFunc(email, password, username)
    }
  }
  const {
    username,
    email,
    password,
    passwordConfirm,
    usernameError,
    emailError,
    passwordError,
    passwordConfirmError,
    isSignUpFormValid,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleUsernameBlur,
    handleEmailBlur,
    handlePasswordBlur,
    handlePasswordConfirmBlur,
  } = useForm()

  return (
    <>
      <p className=" text-gray-700 mb-4">
        <Link
          href="/terms"
          className="text-brand-color hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          利用規約
        </Link>
        および
        <Link
          href="/privacy"
          className="text-brand-color hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          プライバシーポリシー
        </Link>
        に同意した上で、
        <br />
        以下の「登録」ボタンを押してください。
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="username"
          type="text"
          labelName="ユーザー名"
          srOnly={true}
          placeholder="ユーザー名"
          maxLength={MAX_USERNAME_LENGTH}
          value={username}
          onChange={handleUsernameChange}
          onBlur={handleUsernameBlur}
          error={usernameError}
        />
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
        <InputField
          id="password-confirm"
          type="password"
          labelName="パスワード（確認用）"
          srOnly={true}
          placeholder="パスワード（確認用）"
          maxLength={MAX_PASSWORD_LENGTH}
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          onBlur={handlePasswordConfirmBlur}
          error={passwordConfirmError}
        />
        <FormButton
          label="登録"
          isFormValid={isSignUpFormValid}
          loading={signupLoading}
        />
      </form>

      <DividerWithText text="または" />

      <GoogleButton text="Googleで登録" />
      <SwitchFormLink
        text="会員登録済の方は"
        formName={FORM_LOGIN}
        onClick={setForm}
      />
    </>
  )
}
