import { screen, render, fireEvent } from '@testing-library/react'
import { useAuthContextMock } from '@/__test__/utils/mocks'
import { Header } from '@/components/Header'
import {
  MAX_USERNAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '@/utils/constants'

const renderSignUpForm = () => {
  useAuthContextMock.mockReturnValue({
    currentUser: null,
  })

  render(<Header />)

  fireEvent.click(screen.getByText('新規登録'))
}

// 正常系のテストはHeader.test.tsxで実施するため、異常系のテストのみ扱う
describe('新規登録フォーム確認時', () => {
  beforeEach(() => {
    renderSignUpForm()
  })

  it('ユーザー名のバリデーションが正しいこと', () => {
    const username = screen.getByLabelText('ユーザー名')

    // 上限チェック
    fireEvent.change(username, {
      target: { value: 'a'.repeat(21) },
    })
    screen.getByText(
      `ユーザー名は${MAX_USERNAME_LENGTH}文字以下で入力してください`
    )

    // 空文字チェック
    fireEvent.change(username, {
      target: { value: '' },
    })
    screen.getByText('ユーザー名を入力してください')
  })

  it('メールアドレスのバリデーションが正しいこと', () => {
    const email = screen.getByLabelText('メールアドレス')

    // パターンチェック
    fireEvent.change(email, {
      target: { value: 'mock@mock' },
    })
    fireEvent.blur(email)
    screen.getByText('メールアドレスが正しくありません')

    // 上限チェック
    fireEvent.change(email, {
      target: { value: 'a'.repeat(251) + '.com' },
    })
    fireEvent.blur(email)
    screen.getByText(
      `メールアドレスは${MAX_EMAIL_LENGTH}文字以下で入力してください`
    )

    // 空文字チェック
    fireEvent.change(email, {
      target: { value: '' },
    })
    fireEvent.blur(email)
    screen.getByText('メールアドレスを入力してください')
  })

  it('パスワードのバリデーションが正しいこと', () => {
    const password = screen.getByLabelText('パスワード')

    // パターンチェック
    fireEvent.change(password, {
      target: { value: 'mockpass777' },
    })
    fireEvent.blur(password)
    screen.getByText('パスワードは英大文字、英小文字、数字を全て含めてください')

    // 上限チェック
    fireEvent.change(password, {
      target: { value: 'MocPass777' + 'a'.repeat(245) },
    })
    fireEvent.blur(password)
    screen.getByText(
      `パスワードは${MAX_PASSWORD_LENGTH}文字以下で入力してください`
    )

    // 下限チェック
    fireEvent.change(password, {
      target: { value: 'MocP777' },
    })
    fireEvent.blur(password)
    screen.getByText(
      `パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください`
    )

    // 空文字チェック
    fireEvent.change(password, {
      target: { value: '' },
    })
    fireEvent.blur(password)
    screen.getByText('パスワードを入力してください')
  })

  it('パスワード（確認用）のバリデーションが正しいこと', () => {
    const password = screen.getByLabelText('パスワード')
    const passwordConfirm = screen.getByLabelText('パスワード（確認用）')

    // 一致チェック
    fireEvent.change(password, {
      target: { value: 'MocPass777' },
    })
    fireEvent.change(passwordConfirm, {
      target: { value: 'MocPass77' },
    })
    fireEvent.blur(passwordConfirm)
    screen.getByText('パスワードが一致しません')

    // 空文字チェック
    fireEvent.change(passwordConfirm, {
      target: { value: '' },
    })
    fireEvent.blur(passwordConfirm)
    screen.getByText('パスワード（確認用）を入力してください')
  })
})
