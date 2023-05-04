import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import 'react-responsive-modal/styles.css'
import { useForm } from '@/hooks/useForm'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { InputField } from '@/components/InputField'
import { FormButton } from '@/components/FormButton'

export default function Settings() {
  const router = useRouter()
  const { showToast } = useToast()

  const { loading, updateUser, currentUser, dbUserData } = useAuthContext()

  const updateUserFunc = async (username: string, email: string) => {
    await updateUser(username, email)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isUpdateUserFormValid) {
      updateUserFunc(username, email)
    }
  }

  const {
    username,
    email,
    usernameError,
    emailError,
    isUpdateUserFormValid,
    handleUsernameChange,
    handleEmailChange,
    handleUsernameBlur,
    handleEmailBlur,
  } = useForm()

  useEffect(() => {
    if (currentUser) {
      handleEmailChange({
        target: { value: currentUser.email },
      } as React.ChangeEvent<HTMLInputElement>)
    }
    if (dbUserData) {
      handleUsernameChange({
        target: { value: dbUserData.name },
      } as React.ChangeEvent<HTMLInputElement>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, dbUserData])

  useEffect(() => {
    if (currentUser === undefined) {
      // 認証状態がまだ取得できていない場合は、何もしない
      return
    }

    if (!loading && currentUser === null) {
      router.push('/')
      showToast('error', 'ログインしてください。')
    }
  }, [loading, currentUser, router, showToast])

  return (
    <>
      {currentUser && (
        <div className="mx-auto max-w-md">
          <h2 className="text-xl font-semibold mt-5 mb-5 text-gray-700">
            アカウント設定
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              id="username"
              type="text"
              labelName="ユーザー名"
              maxLength={20}
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              error={usernameError}
            />
            <InputField
              id="email"
              type="email"
              labelName="メールアドレス"
              maxLength={254}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              error={emailError}
            />
            <FormButton label="更新" isFormValid={isUpdateUserFormValid} />
          </form>
        </div>
      )}
    </>
  )
}
