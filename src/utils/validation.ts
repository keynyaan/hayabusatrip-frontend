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
