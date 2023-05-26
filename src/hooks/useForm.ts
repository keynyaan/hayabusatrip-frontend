import { useState } from 'react'
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateTripTitle,
  validateStartDate,
  validateEndDate,
} from '@/utils/validation'
import { getToday, getTomorrow, getNextDay } from '@/utils/getDate'

export const useForm = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [tripTitle, setTripTitle] = useState('')
  const [tripDestination, setTripDestination] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [tripTitleError, setTripTitleError] = useState('')
  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  const [startDate, setStartDate] = useState(getToday())
  const [endDate, setEndDate] = useState(getTomorrow())

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
    !validateTripTitle(tripTitle) &&
    tripDestination !== '' &&
    Boolean(startDate) &&
    !validateStartDate(startDate) &&
    Boolean(endDate) &&
    !validateEndDate(startDate, endDate)

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

  const handleUsernameBlur = () => setUsernameError(validateUsername(username))
  const handleEmailBlur = () => setEmailError(validateEmail(email))
  const handlePasswordBlur = () => setPasswordError(validatePassword(password))
  const handlePasswordConfirmBlur = () =>
    setPasswordConfirmError(validatePasswordConfirm(password, passwordConfirm))
  const handleTripTitleBlur = () =>
    setTripTitleError(validateTripTitle(tripTitle))

  return {
    username,
    email,
    password,
    passwordConfirm,
    tripTitle,
    tripDestination,
    startDate,
    endDate,
    usernameError,
    emailError,
    passwordError,
    passwordConfirmError,
    tripTitleError,
    startDateError,
    endDateError,
    isSignUpFormValid,
    isLoginFormValid,
    isPasswordResetFormValid,
    isUpdateUserFormValid,
    isCreateTripFormValid,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleTripTitleChange,
    handleUsernameBlur,
    handleEmailBlur,
    handlePasswordBlur,
    handlePasswordConfirmBlur,
    handleTripTitleBlur,
    handleTripDestinationChange,
    handleStartDateChange,
    handleEndDateChange,
  }
}
