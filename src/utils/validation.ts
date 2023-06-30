import { isBefore } from 'date-fns'
import { parseTimeObj } from '@/utils/getDate'
import {
  MIN_DATE_OBJ,
  MAX_DATE_OBJ,
  MAX_COST,
  MAX_SPOT_MEMO,
  MAX_SPOT_NAME,
} from '@/utils/constants'

export const validateUsername = (username: string) => {
  // ひらがな、カタカナ（全角）、カタカナ（半角）、長音記号、漢字、数字（半角）、数字（全角）、
  // 英語（小文字・大文字・半角）、英語（小文字・大文字・全角）のみ許可
  const pattern = /^[ぁ-んァ-ヶｱ-ﾝﾞﾟー一-龠々ゔ０-９0-9a-zA-Zａ-ｚＡ-Ｚ]+$/
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

export const validateTripTitle = (tripTitle: string) => {
  // ひらがな、カタカナ（全角）、カタカナ（半角）、長音記号、漢字、数字（半角）、数字（全角）、
  // 英語（小文字・大文字・半角）、英語（小文字・大文字・全角）のみ許可
  const pattern = /^[ぁ-んァ-ヶｱ-ﾝﾞﾟー一-龠々ゔ０-９0-9a-zA-Zａ-ｚＡ-Ｚ]+$/
  if (tripTitle === '') return '旅行タイトルを入力してください'
  if (!pattern.test(tripTitle)) {
    return '旅行タイトルは日本語または英数字を使用してください'
  }
  return ''
}

export const validateSpotName = (spotName: string) => {
  // ひらがな、カタカナ（全角）、カタカナ（半角）、長音記号、漢字、数字（半角）、数字（全角）、
  // 英語（小文字・大文字・半角）、英語（小文字・大文字・全角）のみ許可
  const pattern = /^[ぁ-んァ-ヶｱ-ﾝﾞﾟー一-龠々ゔ０-９0-9a-zA-Zａ-ｚＡ-Ｚ]+$/
  if (spotName === '') return 'スポット名を入力してください'
  if (!pattern.test(spotName)) {
    return 'スポット名は日本語または英数字を使用してください'
  }

  if (spotName.length > MAX_SPOT_NAME)
    return `スポット名は${MAX_SPOT_NAME}文字以下で入力してください`
  return ''
}

export const validateStartDate = (startDate: string) => {
  if (startDate === '') return '開始日を入力してください'

  const startDateObj = new Date(startDate)

  if (startDateObj < MIN_DATE_OBJ || startDateObj > MAX_DATE_OBJ) {
    return '開始日は2000年1月1日から9999年12月31日の間の日付を入力してください'
  }

  return ''
}

export const validateEndDate = (startDate: string, endDate: string) => {
  if (endDate === '') return '終了日を入力してください'

  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)

  if (endDateObj < MIN_DATE_OBJ || endDateObj > MAX_DATE_OBJ) {
    return '終了日は2000年1月1日から9999年12月31日の間の日付を入力してください'
  }

  if (endDateObj < startDateObj) {
    return '終了日は開始日以降の日付を入力してください'
  }

  return ''
}

export const validateStartTime = (startTime: string) => {
  if (startTime === '') return '開始時間を入力してください'

  return ''
}

export const validateEndTime = (startTime: string, endTime: string) => {
  if (endTime === '') return '終了時間を入力してください'

  const startTimeObj = parseTimeObj(startTime)
  const endTimeObj = parseTimeObj(endTime)

  if (isBefore(endTimeObj, startTimeObj)) {
    return '終了時間は開始時間以降の時間を入力してください'
  }

  return ''
}

export const validateCost = (cost: string) => {
  if (cost === '') return '費用を入力してください'
  if (parseInt(cost) > MAX_COST) return '費用は1億未満の数値を入力してください'

  return ''
}

export const validateSpotMemo = (spotMemo: string) => {
  if (spotMemo.length > MAX_SPOT_MEMO)
    return `一言メモは${MAX_SPOT_MEMO}文字以下で入力してください`

  return ''
}
