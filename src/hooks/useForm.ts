import { useState } from 'react'
import { OptionType } from '@/components/SelectWithIconField'
import { SPOT_CATEGORY_OPTIONS } from '@/utils/constants'
import {
  getToday,
  getTomorrow,
  getNextDay,
  getOneHourAhead,
} from '@/utils/getDate'
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateTripTitle,
  validateSpotName,
  validateStartDate,
  validateEndDate,
  validateStartTime,
  validateEndTime,
  validateCost,
  validateSpotMemo,
} from '@/utils/validation'

export const useForm = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [tripTitle, setTripTitle] = useState('')
  const [tripDestination, setTripDestination] = useState('')
  const [startDate, setStartDate] = useState(getToday())
  const [endDate, setEndDate] = useState(getTomorrow())
  const [spotName, setSpotName] = useState('')
  const [spotCategory, setSpotCategory] = useState<string>(
    SPOT_CATEGORY_OPTIONS[0].value
  )
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [cost, setCost] = useState('0')
  const [spotMemo, setSpotMemo] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [tripTitleError, setTripTitleError] = useState('')
  const [spotNameError, setSpotNameError] = useState('')
  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  const [startTimeError, setStartTimeError] = useState('')
  const [endTimeError, setEndTimeError] = useState('')
  const [costError, setCostError] = useState('')
  const [spotMemoError, setSpotMemoError] = useState('')

  const isSignUpFormValid: boolean =
    Boolean(username) &&
    Boolean(email) &&
    Boolean(password) &&
    Boolean(passwordConfirm) &&
    !validateUsername(username) &&
    !validateEmail(email) &&
    !validatePassword(password) &&
    !validatePasswordConfirm(password, passwordConfirm)

  const isLoginFormValid: boolean =
    Boolean(email) &&
    Boolean(password) &&
    !validateEmail(email) &&
    !validatePassword(password)

  const isPasswordResetFormValid: boolean =
    Boolean(email) && !validateEmail(email)

  const isUpdateUserFormValid: boolean =
    Boolean(username) &&
    Boolean(email) &&
    !validateUsername(username) &&
    !validateEmail(email)

  const isCreateTripFormValid: boolean =
    Boolean(tripTitle) &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    tripDestination !== '' &&
    !validateTripTitle(tripTitle) &&
    !validateStartDate(startDate) &&
    !validateEndDate(startDate, endDate)

  const isTripTitleFormValid: boolean =
    Boolean(tripTitle) && !validateTripTitle(tripTitle)

  const isTripDestinationFormValid: boolean = tripDestination !== ''

  const isSpotFormValid: boolean =
    Boolean(spotName) &&
    Boolean(spotCategory) &&
    Boolean(startTime) &&
    Boolean(endTime) &&
    Boolean(cost) &&
    !validateSpotName(spotName) &&
    !validateStartTime(startTime) &&
    !validateEndTime(startTime, endTime) &&
    !validateCost(cost)

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value)
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setPasswordConfirm(e.target.value)
  const handleTripTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTripTitle(e.target.value)
  const handleTripDestinationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => setTripDestination(e.target.value)
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    const parsedDate = Date.parse(newStartDate)

    setStartDate(newStartDate)
    setStartDateError(validateStartDate(newStartDate))

    if (!isNaN(parsedDate)) {
      const newEndDate = getNextDay(newStartDate)
      setEndDate(newEndDate)
      // 終了日にエラーが出ている状態で、開始日を変更してもエラーが消えない対策
      setEndDateError(validateEndDate(newStartDate, newEndDate))
    }
  }
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)
    setEndDateError(validateEndDate(startDate, newEndDate))
  }
  const handleSpotNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpotName = e.target.value

    setSpotName(newSpotName)
    setSpotNameError(validateSpotName(newSpotName))
  }
  const handleSpotCategoryChange = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      setSpotCategory(selectedOption.value)
    }
  }
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value

    setStartTime(newStartTime)
    setStartTimeError(validateStartTime(newStartTime))

    if (newStartTime !== '') {
      const newEndTime = getOneHourAhead(newStartTime)
      setEndTime(newEndTime)
      // 終了日にエラーが出ている状態で、開始日を変更してもエラーが消えない対策
      setEndTimeError(validateEndTime(newStartTime, newEndTime))
    }
  }
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value
    setEndTime(newEndTime)
    setEndTimeError(validateEndTime(startTime, newEndTime))
  }
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCostStr = e.target.value
    const isValidNumber = /^0$|^[1-9]\d*$/.test(newCostStr)

    if (newCostStr === '' || isValidNumber) {
      setCost(newCostStr)
      setCostError(validateCost(newCostStr))
    }
  }
  const handleSpotMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSpotMemo = e.target.value
    setSpotMemo(newSpotMemo)
    setSpotMemoError(validateSpotMemo(newSpotMemo))
  }

  const handleUsernameBlur = () => setUsernameError(validateUsername(username))
  const handleEmailBlur = () => setEmailError(validateEmail(email))
  const handlePasswordBlur = () => setPasswordError(validatePassword(password))
  const handlePasswordConfirmBlur = () =>
    setPasswordConfirmError(validatePasswordConfirm(password, passwordConfirm))
  const handleTripTitleBlur = () =>
    setTripTitleError(validateTripTitle(tripTitle))
  const handleSpotNameBlur = () => setSpotNameError(validateSpotName(spotName))
  const handleStartTimeBlur = () =>
    setStartTimeError(validateStartTime(startTime))
  const handleEndTimeBlur = () =>
    setEndTimeError(validateEndTime(startTime, endTime))
  const handleCostBlur = () => setCostError(validateCost(cost))
  const handleSpotMemoBlur = () => setSpotMemoError(validateSpotMemo(spotMemo))

  return {
    username,
    email,
    password,
    passwordConfirm,
    tripTitle,
    tripDestination,
    startDate,
    endDate,
    spotName,
    spotCategory,
    startTime,
    endTime,
    cost,
    spotMemo,
    usernameError,
    emailError,
    passwordError,
    passwordConfirmError,
    tripTitleError,
    spotNameError,
    startDateError,
    endDateError,
    startTimeError,
    endTimeError,
    costError,
    spotMemoError,
    isSignUpFormValid,
    isLoginFormValid,
    isPasswordResetFormValid,
    isUpdateUserFormValid,
    isCreateTripFormValid,
    isTripTitleFormValid,
    isTripDestinationFormValid,
    isSpotFormValid,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleTripTitleChange,
    handleTripDestinationChange,
    handleStartDateChange,
    handleEndDateChange,
    handleSpotNameChange,
    handleSpotCategoryChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleCostChange,
    handleSpotMemoChange,
    handleUsernameBlur,
    handleEmailBlur,
    handlePasswordBlur,
    handlePasswordConfirmBlur,
    handleTripTitleBlur,
    handleSpotNameBlur,
    handleStartTimeBlur,
    handleEndTimeBlur,
    handleCostBlur,
    handleSpotMemoBlur,
  }
}
