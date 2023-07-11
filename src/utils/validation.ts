import { isBefore } from 'date-fns'
import { differenceInDatesNum, parseTimeObj } from '@/utils/getDate'
import {
  MIN_DATE_OBJ,
  MAX_DATE_OBJ,
  MAX_COST,
  MAX_SPOT_MEMO,
  MAX_SPOT_NAME,
  MAX_TRIP_MEMO,
  MAX_TRIP_DURATION,
  MAX_TRIP_TITLE_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_USERNAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@/utils/constants'

export const validateUsername = (username: string) => {
  if (!/\S/.test(username)) {
    return 'ユーザー名を入力してください'
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return `ユーザー名は${MAX_USERNAME_LENGTH}文字以下で入力してください`
  }

  return ''
}

export const validateEmail = (email: string) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i

  if (email === '') {
    return 'メールアドレスを入力してください'
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return `メールアドレスは${MAX_EMAIL_LENGTH}文字以下で入力してください`
  }

  if (!pattern.test(email)) {
    return 'メールアドレスが正しくありません'
  }

  return ''
}

export const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (password === '') {
    return 'パスワードを入力してください'
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください`
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `パスワードは${MAX_PASSWORD_LENGTH}文字以下で入力してください`
  }

  if (!(hasUpperCase && hasLowerCase && hasNumber)) {
    return 'パスワードは英大文字、英小文字、数字を全て含めてください'
  }

  return ''
}

export const validatePasswordConfirm = (
  password: string,
  passwordConfirm: string
) => {
  if (passwordConfirm === '') {
    return 'パスワード（確認用）を入力してください'
  }

  if (password !== passwordConfirm) {
    return 'パスワードが一致しません'
  }

  return ''
}

export const validateTripTitle = (tripTitle: string) => {
  if (!/\S/.test(tripTitle)) {
    return '旅行タイトルを入力してください'
  }

  if (tripTitle.length > MAX_TRIP_TITLE_LENGTH) {
    return `旅行タイトルは${MAX_TRIP_TITLE_LENGTH}文字以下で入力してください`
  }

  return ''
}

export const validateSpotName = (spotName: string) => {
  if (!/\S/.test(spotName)) {
    return 'スポット名を入力してください'
  }

  if (spotName.length > MAX_SPOT_NAME) {
    return `スポット名は${MAX_SPOT_NAME}文字以下で入力してください`
  }

  return ''
}

export const validateStartDate = (startDate: string) => {
  const startDateObj = new Date(startDate)

  if (startDate === '') {
    return '開始日を入力してください'
  }

  if (startDateObj < MIN_DATE_OBJ || startDateObj > MAX_DATE_OBJ) {
    return '開始日は2000年1月1日から9999年12月31日の間の日付を入力してください'
  }

  return ''
}

export const validateEndDate = (startDate: string, endDate: string) => {
  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)

  if (endDate === '') {
    return '終了日を入力してください'
  }

  if (endDateObj < MIN_DATE_OBJ || endDateObj > MAX_DATE_OBJ) {
    return '終了日は2000年1月1日から9999年12月31日の間の日付を入力してください'
  }

  if (endDateObj < startDateObj) {
    return '終了日は開始日以降の日付を入力してください'
  }

  if (!(differenceInDatesNum(endDate, startDate) < MAX_TRIP_DURATION)) {
    return `終了日は開始日から${MAX_TRIP_DURATION}日以内に設定してください`
  }

  return ''
}

export const validateStartTime = (startTime: string) => {
  if (startTime === '') {
    return '開始時間を入力してください'
  }

  return ''
}

export const validateEndTime = (startTime: string, endTime: string) => {
  const startTimeObj = parseTimeObj(startTime)
  const endTimeObj = parseTimeObj(endTime)

  if (endTime === '') {
    return '終了時間を入力してください'
  }

  if (isBefore(endTimeObj, startTimeObj)) {
    return '終了時間は開始時間以降の時間を入力してください'
  }

  return ''
}

export const validateCost = (cost: string) => {
  if (cost === '') {
    return '費用を入力してください'
  }

  if (parseInt(cost) > MAX_COST) {
    return '費用は1億未満の数値を入力してください'
  }

  return ''
}

export const validateTripMemo = (tripMemo: string) => {
  if (tripMemo.length > MAX_TRIP_MEMO) {
    return `メモは${MAX_TRIP_MEMO}文字以下で入力してください`
  }

  return ''
}

export const validateSpotMemo = (spotMemo: string) => {
  if (spotMemo.length > MAX_SPOT_MEMO) {
    return `一言メモは${MAX_SPOT_MEMO}文字以下で入力してください`
  }

  return ''
}
