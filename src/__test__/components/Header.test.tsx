import {
  screen,
  render,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import { testCreateTrip } from '@/__test__/utils/commonTest'
import {
  currentUserMock,
  dbUserDataMock,
  dbTripsDataMock,
  configureApiMocks,
  useAuthContextMock,
  logoutMock,
  loginWithEmailAndPasswordMock,
  resetPasswordMock,
  loginWithGoogleMock,
  signupMock,
} from '@/__test__/utils/mocks'
import { Header } from '@/components/Header'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderHeaderWithMock = (props: any = {}) => {
  useAuthContextMock.mockReturnValue({
    currentUser: props.currentUser || currentUserMock,
    dbUserData: props.currentUser || dbUserDataMock,
    dbTripsData: props.dbTripsData || dbTripsDataMock,
    authLoading: props.authLoading || false,
    signup: signupMock,
    loginWithEmailAndPassword: loginWithEmailAndPasswordMock,
    loginWithGoogle: loginWithGoogleMock,
    logout: logoutMock,
    resetPassword: resetPasswordMock,

    ...props,
  })
  configureApiMocks()
  return render(<Header />)
}

describe('ヘッダー確認時', () => {
  describe('ログイン時', () => {
    describe('ロゴの確認時', () => {
      it('トップページへのリンクになっていること', () => {
        renderHeaderWithMock()

        const logoLink = screen.getByAltText('サイトのロゴ').closest('a')
        expect(logoLink).toHaveAttribute('href', '/')

        const logoNameLink = screen.getByAltText('サイトのロゴ名').closest('a')
        expect(logoNameLink).toHaveAttribute('href', '/')
      })
    })

    describe('旅行プラン作成ボタンの確認時', () => {
      it('旅行プランを作成できること', async () => {
        renderHeaderWithMock()

        await testCreateTrip('旅行プラン作成')
      })
    })

    describe('ユーザーアイコンクリック時', () => {
      beforeEach(async () => {
        renderHeaderWithMock()
        fireEvent.click(screen.getByAltText('ユーザーのアイコン画像'))
      })

      it('アカウント設定ボタンが正しいリンクであること', async () => {
        // アカウント設定ボタンのaタグ要素を取得
        const settingsLink = screen
          .getByRole('button', {
            name: 'アカウント設定',
          })
          .closest('a')

        // href属性が正しいことを確認
        expect(settingsLink).toHaveAttribute('href', '/settings')
      })

      it('ログアウトボタンがあること', async () => {
        // ログアウトボタンをクリック
        fireEvent.click(screen.getByText('ログアウト'))

        // APIが実行されることの確認
        await waitFor(() => {
          expect(logoutMock).toHaveBeenCalled()
        })
      })
    })
  })

  describe('非ログイン時', () => {
    describe('ロゴの確認時', () => {
      it('トップページへのリンクになっていること', () => {
        renderHeaderWithMock({ currentUser: null })

        const logoLink = screen.getByAltText('サイトのロゴ').closest('a')
        expect(logoLink).toHaveAttribute('href', '/')

        const logoNameLink = screen.getByAltText('サイトのロゴ名').closest('a')
        expect(logoNameLink).toHaveAttribute('href', '/')
      })
    })

    describe('ログインボタンクリック時', () => {
      beforeEach(async () => {
        renderHeaderWithMock({ currentUser: null })
        fireEvent.click(screen.getByText('ログイン'))
      })

      it('ログインできること', async () => {
        // 初期値の確認
        expect(screen.getByLabelText('メールアドレス')).toHaveValue('')
        expect(screen.getByLabelText('パスワード')).toHaveValue('')

        // ログインボタンがdisabledであることの確認
        const loginButton = screen.getByText('ログイン', {
          selector: 'button[type="submit"]',
        })
        expect(loginButton).toBeDisabled()

        // メールアドレスの設定
        fireEvent.change(screen.getByLabelText('メールアドレス'), {
          target: { value: 'mock@mock.com' },
        })

        // パスワードの設定
        fireEvent.change(screen.getByLabelText('パスワード'), {
          target: { value: 'MockPass1' },
        })

        // ログインボタンがdisabledでないことの確認
        expect(loginButton).not.toBeDisabled()

        // ログインボタンをクリック
        fireEvent.click(loginButton)

        // 実行時のAPIパラメーターの確認
        await waitFor(() => {
          expect(loginWithEmailAndPasswordMock).toHaveBeenCalledWith(
            'mock@mock.com',
            'MockPass1'
          )
        })
      })

      it('パスワード再設定ができること', async () => {
        // 「パスワードをお忘れの方は」のp要素を取得
        const paragraph = screen
          .getByText('パスワードをお忘れの方は')
          .closest('p')
        if (!paragraph) {
          throw new Error('paragraph not found')
        }

        // p要素内で「こちら」ボタンを取得
        const forgotPasswordButton = within(paragraph).getByText('こちら')

        // ボタンをクリック
        fireEvent.click(forgotPasswordButton)

        // 初期値の確認
        expect(screen.getByLabelText('メールアドレス')).toHaveValue('')

        // パスワード再設定ボタンがdisabledであることの確認
        const resetPasswordButton = screen.getByRole('button', {
          name: 'パスワード再設定メールを送信',
        })
        expect(resetPasswordButton).toBeDisabled()

        // メールアドレスの設定
        fireEvent.change(screen.getByLabelText('メールアドレス'), {
          target: { value: 'mock@mock.com' },
        })

        // パスワード再設定ボタンがdisabledでないことの確認
        expect(resetPasswordButton).not.toBeDisabled()

        // パスワード再設定ボタンをクリック
        fireEvent.click(resetPasswordButton)

        // 実行時のAPIパラメーターの確認
        await waitFor(() => {
          expect(resetPasswordMock).toHaveBeenCalledWith('mock@mock.com')
        })
      })

      it('Googleでログインできること', async () => {
        // Googleでログインボタンがdisabledであることの確認
        const googleLoginButton = screen.getByRole('button', {
          name: /Googleでログイン/,
        })

        // Googleでログインボタンをクリック
        fireEvent.click(googleLoginButton)

        // APIが実行されることの確認
        await waitFor(() => {
          expect(loginWithGoogleMock).toHaveBeenCalled()
        })
      })

      it('新規登録フォームが開くこと', async () => {
        // 「新規登録の方は」のp要素を取得
        const paragraph = screen.getByText('新規登録の方は').closest('p')
        if (!paragraph) {
          throw new Error('paragraph not found')
        }

        // p要素内で「こちら」ボタンを取得
        const signupButton = within(paragraph).getByText('こちら')

        // ボタンをクリック
        fireEvent.click(signupButton)

        // タイトルの確認
        expect(
          screen.getByRole('heading', { name: '新規登録' })
        ).toBeInTheDocument()
      })
    })

    describe('新規登録ボタンクリック時', () => {
      beforeEach(async () => {
        renderHeaderWithMock({ currentUser: null })
        fireEvent.click(screen.getByText('新規登録'))
      })

      it('利用規約が正しいリンクであること', async () => {
        expect(screen.getByRole('link', { name: '利用規約' })).toHaveAttribute(
          'href',
          '/terms'
        )
      })

      it('プライバシーポリシーが正しいリンクであること', async () => {
        expect(
          screen.getByRole('link', { name: 'プライバシーポリシー' })
        ).toHaveAttribute('href', '/privacy')
      })

      it('ログインできること', async () => {
        // 初期値の確認
        expect(screen.getByLabelText('ユーザー名')).toHaveValue('')
        expect(screen.getByLabelText('メールアドレス')).toHaveValue('')
        expect(screen.getByLabelText('パスワード')).toHaveValue('')
        expect(screen.getByLabelText('パスワード（確認用）')).toHaveValue('')

        // 登録ボタンがdisabledであることの確認
        const signupButton = screen.getByText('登録', {
          selector: 'button[type="submit"]',
        })
        expect(signupButton).toBeDisabled()

        // ユーザー名の設定
        fireEvent.change(screen.getByLabelText('ユーザー名'), {
          target: { value: 'nameMock' },
        })

        // メールアドレスの設定
        fireEvent.change(screen.getByLabelText('メールアドレス'), {
          target: { value: 'mock@mock.com' },
        })

        // パスワードの設定
        fireEvent.change(screen.getByLabelText('パスワード'), {
          target: { value: 'MockPass1' },
        })

        // パスワード（確認用）の設定
        fireEvent.change(screen.getByLabelText('パスワード（確認用）'), {
          target: { value: 'MockPass1' },
        })

        // 登録ボタンがdisabledでないことの確認
        expect(signupButton).not.toBeDisabled()

        // 登録ボタンをクリック
        fireEvent.click(signupButton)

        // 実行時のAPIパラメーターの確認
        await waitFor(() => {
          expect(signupMock).toHaveBeenCalledWith(
            'mock@mock.com',
            'MockPass1',
            'nameMock'
          )
        })
      })

      it('Googleで登録できること', async () => {
        // Googleで登録ボタンがdisabledであることの確認
        const googleSignupnButton = screen.getByRole('button', {
          name: /Googleで登録/,
        })

        // Googleで登録ボタンをクリック
        fireEvent.click(googleSignupnButton)

        // APIが実行されることの確認
        await waitFor(() => {
          expect(loginWithGoogleMock).toHaveBeenCalled()
        })
      })

      it('ログインフォームが開くこと', async () => {
        // 「会員登録済の方は」のp要素を取得
        const paragraph = screen.getByText('会員登録済の方は').closest('p')
        if (!paragraph) {
          throw new Error('paragraph not found')
        }

        // p要素内で「こちら」ボタンを取得
        const loginButton = within(paragraph).getByText('こちら')

        // ボタンをクリック
        fireEvent.click(loginButton)

        // タイトルの確認
        expect(
          screen.getByRole('heading', { name: 'ログイン' })
        ).toBeInTheDocument()
      })
    })
  })
})
