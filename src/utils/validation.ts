import { MIN_DATE_OBJ, MAX_DATE_OBJ } from '@/utils/constants'

export const validateUsername = (username: string) => {
  // ひらがな、カタカナ（全角）、カタカナ（半角）、漢字、数字（半角）、数字（全角）、
  // 英語（小文字・大文字・半角）、英語（小文字・大文字・全角）のみ許可
  const pattern = /^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠々ゔ０-９0-9a-zA-Zａ-ｚＡ-Ｚ]+$/
  if (username === '') return 'ユーザー名を入力してください'
  if (!pattern.test(username)) {
    return 'ユーザー名は日本語または英数字を使用してください'
  }
  return ''
}

export const validateEmail = (email: string) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
  if (email === '') return 'メールアドレスを入力してください'
  if (!pattern.test(email)) return 'メールアドレスが正しくありません'
  return ''
}

export const validatePassword = (password: string) => {
  const minLength = 8
  const maxLength = 64
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (password === '') return 'パスワードを入力してください'
  if (password.length < minLength)
    return 'パスワードは8文字以上で入力してください'
  if (password.length > maxLength)
    return 'パスワードは64文字以下で入力してください'
  if (!(hasUpperCase && hasLowerCase && hasNumber)) {
    return 'パスワードは英大文字、英小文字、数字を全て含めてください'
  }
  return ''
}

export const validatePasswordConfirm = (
  password: string,
  passwordConfirm: string
) => {
  if (passwordConfirm === '') return 'パスワード（確認用）を入力してください'
  if (password !== passwordConfirm) return 'パスワードが一致しません'
  return ''
}

export const validateTripTitle = (username: string) => {
  // ひらがな、カタカナ（全角）、カタカナ（半角）、漢字、数字（半角）、数字（全角）、
  // 英語（小文字・大文字・半角）、英語（小文字・大文字・全角）のみ許可
  const pattern = /^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠々ゔ０-９0-9a-zA-Zａ-ｚＡ-Ｚ]+$/
  if (username === '') return '旅行タイトルを入力してください'
  if (!pattern.test(username)) {
    return '旅行タイトルは日本語または英数字を使用してください'
  }
  return ''
}

export const validateStartDate = (startDate: string) => {
  if (startDate === '') return '開始日を入力してください'

  const startDateObj = new Date(startDate)

  if (startDateObj < MIN_DATE_OBJ || startDateObj > MAX_DATE_OBJ) {
    return '開始日は1000年1月1日から9999年12月31日の間の日付を入力してください'
  }

  return ''
}

export const validateEndDate = (startDate: string, endDate: string) => {
  if (endDate === '') return '終了日を入力してください'

  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)

  if (endDateObj < MIN_DATE_OBJ || endDateObj > MAX_DATE_OBJ) {
    return '終了日は1000年1月1日から9999年12月31日の間の日付を入力してください'
  }

  if (endDateObj < startDateObj) {
    return '終了日は開始日以降の日付を入力してください'
  }

  return ''
}
