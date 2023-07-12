import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import 'react-responsive-modal/styles.css'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { InputField } from '@/components/InputField'
import { DividerWithText } from '@/components/DividerWithText'
import { FormButton } from '@/components/FormButton'
import { Meta } from '@/components/Meta'
import { SettingsModal } from '@/components/SettingsModal'
import { SecondaryButton } from '@/components/SecondaryButton'
import { UserIcon } from '@/components/UserIcon'
import { useForm } from '@/hooks/useForm'
import {
  FORM_PASSWORD_RESET,
  FORM_DELETE_ACCOUNT,
  MAX_EMAIL_LENGTH,
  MAX_USERNAME_LENGTH,
  SETTINGS_PAGE_DESC,
  SETTINGS_PAGE_TITLE,
  NOT_LOGIN_ERROR_MSG,
} from '@/utils/constants'

export default function Settings() {
  const router = useRouter()
  const { showToast } = useToast()

  const {
    authLoading,
    deleteAccountLoading,
    updateUserLoading,
    updateUser,
    currentUser,
    dbUserData,
  } = useAuthContext()

  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false)
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false)

  const onOpenPasswordResetModal = () => {
    setPasswordResetModalOpen(true)
  }
  const onOpenDeleteAccountModal = () => {
    setDeleteAccountModalOpen(true)
  }

  const onClosePasswordResetModal = () => {
    setPasswordResetModalOpen(false)
  }
  const onCloseDeleteAccountModal = () => {
    setDeleteAccountModalOpen(false)
  }

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

    if (!authLoading && !deleteAccountLoading && currentUser === null) {
      router.push('/')
      showToast('error', NOT_LOGIN_ERROR_MSG)
    }
  }, [authLoading, deleteAccountLoading, currentUser, router, showToast])

  return (
    <>
      {currentUser && (
        <>
          <Meta pageTitle={SETTINGS_PAGE_TITLE} pageDesc={SETTINGS_PAGE_DESC} />
          <div className="mx-auto max-w-md space-y-4 p-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {SETTINGS_PAGE_TITLE}
            </h2>
            <div className="flex justify-center">
              <UserIcon isSettingsPage={true} />
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                id="username"
                type="text"
                labelName="ユーザー名"
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
                maxLength={MAX_EMAIL_LENGTH}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                error={emailError}
              />
              <FormButton
                label="更新"
                isFormValid={isUpdateUserFormValid}
                loading={updateUserLoading}
              />
            </form>

            <DividerWithText text="または" />

            <div className="flex justify-between mt-4">
              <SecondaryButton
                text="パスワード再設定"
                onClick={onOpenPasswordResetModal}
              />
              {passwordResetModalOpen && (
                <SettingsModal
                  open={passwordResetModalOpen}
                  onClose={onClosePasswordResetModal}
                  form={FORM_PASSWORD_RESET}
                />
              )}
              <SecondaryButton
                text="退会のお手続き"
                onClick={onOpenDeleteAccountModal}
                isRedStyle={true}
              />
              {deleteAccountModalOpen && (
                <SettingsModal
                  open={deleteAccountModalOpen}
                  onClose={onCloseDeleteAccountModal}
                  form={FORM_DELETE_ACCOUNT}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
