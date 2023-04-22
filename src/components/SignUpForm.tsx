import Link from 'next/link'
import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { DividerWithText } from '@/components/DividerWithText'
import GoogleButton from '@/components/GoogleButton'
import { InputField } from '@/components/InputField'
import { ModalButton } from '@/components/ModalButton'
import { SwitchFormLink } from '@/components/SwitchFormLink'
import { useSignUpForm } from '@/hooks/useSignUpForm'
import { FORM_LOGIN } from '@/utils/constants'

type SignUpFormProps = {
  setForm: (formName: string) => void
}

export const SignUpForm: FC<SignUpFormProps> = ({ setForm }) => {
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
  } = useSignUpForm()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ここでフォームの送信処理を行います。
  }

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
        以下の「登録する」ボタンを押してください。
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="username"
          type="text"
          placeholder="ユーザー名"
          maxLength={20}
          value={username}
          onChange={handleUsernameChange}
          onBlur={handleUsernameBlur}
          error={usernameError}
        />
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
        <InputField
          id="password-confirm"
          type="password"
          placeholder="パスワード（確認用）"
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          onBlur={handlePasswordConfirmBlur}
          error={passwordConfirmError}
        />
        <ModalButton isFormValid={isSignUpFormValid} label="登録する" />
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
