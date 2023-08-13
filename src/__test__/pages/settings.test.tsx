import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Settings from '@/pages/settings'
import {
  currentUserMock,
  dbUserDataMock,
  configureApiMocks,
  deleteAccountMock,
  pushMock,
  resetPasswordMock,
  updateUserMock,
  uploadUserIconImageMock,
  useAuthContextMock,
} from '@/__test__/utils/mocks'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/settings',
    push: pushMock,
  }),
}))
jest.mock('@/context/AuthContext')
jest.mock('@/hooks/useS3Api')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderSettingsWithMock = (props: any = {}) => {
  useAuthContextMock.mockReturnValue({
    currentUser: props.currentUser || null,
    dbUserData: props.dbUserData || null,
    authLoading: props.authLoading || false,
    deleteAccountLoading: props.deleteAccountLoading || false,
    updateUserLoading: props.updateUserLoading || false,
    updateUser: updateUserMock,
    resetPassword: resetPasswordMock,
    deleteAccount: deleteAccountMock,
    ...props,
  })
  return render(<Settings />)
}

describe('/settingsアクセス時', () => {
  describe('非ログイン時', () => {
    it('トップページが表示されること', () => {
      renderSettingsWithMock()

      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('ログイン時', () => {
    configureApiMocks()

    describe('ユーザー名とメールアドレスの確認時', () => {
      it('ユーザー名とメールアドレスが表示されること', () => {
        renderSettingsWithMock({
          currentUser: currentUserMock,
          dbUserData: dbUserDataMock,
        })

        expect(screen.getByDisplayValue('nameMock')).toBeInTheDocument()
        expect(screen.getByDisplayValue('mock@mock.com')).toBeInTheDocument()
      })

      it('ユーザー名とメールアドレスが更新できること', async () => {
        renderSettingsWithMock({
          currentUser: currentUserMock,
          dbUserData: dbUserDataMock,
        })

        expect(screen.getByDisplayValue('nameMock')).toBeInTheDocument()
        expect(screen.getByDisplayValue('mock@mock.com')).toBeInTheDocument()

        // 更新ボタンがdisabledであることの確認
        const updateButton = screen.getByRole('button', {
          name: '更新',
        })
        expect(updateButton).toBeDisabled()

        // ユーザー名の設定
        fireEvent.change(screen.getByLabelText('ユーザー名'), {
          target: { value: 'nameMock2' },
        })

        // メールアドレスの設定
        fireEvent.change(screen.getByLabelText('メールアドレス'), {
          target: { value: 'mock2@mock.com' },
        })

        // 更新ボタンがdisabledでないことの確認
        expect(updateButton).not.toBeDisabled()

        // 作成ボタンをクリック
        fireEvent.click(updateButton)

        // 実行時のAPIパラメーターの確認
        await waitFor(() => {
          expect(updateUserMock).toHaveBeenCalledWith(
            'nameMock2',
            'mock2@mock.com'
          )
        })
      })
    })

    describe('ユーザーアイコンクリック時', () => {
      it('ユーザーアイコンの変更ができること', async () => {
        renderSettingsWithMock({
          currentUser: currentUserMock,
          dbUserData: dbUserDataMock,
        })

        // input要素の取得
        const fileInput = document.querySelector('input[type="file"]')
        if (!fileInput) {
          throw new Error('fileInput not found')
        }

        // ファイルの選択
        const file = new File(['file-content'], 'file-name.png', {
          type: 'image/png',
        })
        fireEvent.change(fileInput, { target: { files: [file] } })

        // 実行時のAPIパラメーターの確認
        await waitFor(() => {
          expect(uploadUserIconImageMock).toHaveBeenCalledWith(file)
        })
      })
    })

    describe('パスワード再設定ボタンクリック時', () => {
      const setupTest = () => {
        renderSettingsWithMock({
          currentUser: currentUserMock,
          dbUserData: dbUserDataMock,
        })

        const resetPasswordButton = screen.getByRole('button', {
          name: 'パスワード再設定',
        })
        fireEvent.click(resetPasswordButton)
      }

      it('パスワード再設定フォームが表示されること', () => {
        setupTest()

        expect(
          screen.getByText('パスワード再設定', { selector: 'h2' })
        ).toBeInTheDocument()
      })

      it('パスワード再設定処理が実行できること', async () => {
        setupTest()

        // パスワード再設定ボタンをクリック
        const execResetPasswordButton = screen.getByRole('button', {
          name: 'パスワード再設定メールを送信',
        })
        fireEvent.click(execResetPasswordButton)

        // 実行時のAPIパラメーターの確認
        await waitFor(() => {
          expect(resetPasswordMock).toHaveBeenCalledWith(currentUserMock.email)
        })
      })
    })

    describe('退会のお手続きボタンクリック時', () => {
      const setupTest = () => {
        renderSettingsWithMock({
          currentUser: currentUserMock,
          dbUserData: dbUserDataMock,
        })

        const deleteAccountButton = screen.getByRole('button', {
          name: '退会のお手続き',
        })
        fireEvent.click(deleteAccountButton)
      }

      it('退会フォームが表示されること', () => {
        setupTest()

        expect(screen.getByText('退会', { selector: 'h2' })).toBeInTheDocument()
      })

      it('退会処理が実行できること', async () => {
        setupTest()

        // アカウント削除ボタンがdisabledであることの確認
        const execDeleteAccountButton = screen.getByRole('button', {
          name: 'アカウントを削除',
        })
        expect(execDeleteAccountButton).toBeDisabled()

        // チェックボックス要素を取得
        const checkbox = screen.getByRole('checkbox', { name: '同意する' })

        // 初期状態でチェックされていないことを確認
        expect(checkbox).not.toBeChecked()

        // チェックボックスをクリック
        fireEvent.click(checkbox)

        //アカウント削除ボタンがdisabledでないことの確認
        expect(execDeleteAccountButton).not.toBeDisabled()

        // アカウントを削除をクリック
        fireEvent.click(execDeleteAccountButton)

        // APIが実行されることの確認
        await waitFor(() => {
          expect(deleteAccountMock).toHaveBeenCalled()
        })
      })
    })
  })
})
