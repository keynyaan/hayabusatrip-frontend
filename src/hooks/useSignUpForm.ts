import { useState } from 'react'
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation'

export const useSignUpForm = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')

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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value)
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setPasswordConfirm(e.target.value)

  const handleUsernameBlur = () => setUsernameError(validateUsername(username))
  const handleEmailBlur = () => setEmailError(validateEmail(email))
  const handlePasswordBlur = () => setPasswordError(validatePassword(password))
  const handlePasswordConfirmBlur = () =>
    setPasswordConfirmError(validatePasswordConfirm(password, passwordConfirm))

  return {
    username,
    email,
    password,
    passwordConfirm,
    usernameError,
    emailError,
    passwordError,
    passwordConfirmError,
    isSignUpFormValid,
    isLoginFormValid,
    isPasswordResetFormValid,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleUsernameBlur,
    handleEmailBlur,
    handlePasswordBlur,
    handlePasswordConfirmBlur,
  }
}
