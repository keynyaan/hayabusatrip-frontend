import {
  signInWithEmailAndPassword,
  signOut,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateEmail,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { auth } from '@/../initFirebase'
import { useToast } from '@/context/ToastContext'
import {
  DbUserData,
  getUserAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
} from '@/api/userApi'
import { DbTripData, getTripsAPI } from '@/api/tripApi'
import {
  SITE_META,
  GET_USER_ERROR_MSG,
  CREATE_USER_ERROR_MSG,
  UPDATE_USER_ERROR_MSG,
  DELETE_USER_ERROR_MSG,
} from '@/utils/constants'
import { getDatetimeTimestamp } from '@/utils/getTimestamp'

export const useFirebaseAuth = () => {
  const { siteUrl } = SITE_META

  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  )
  const [dbUserData, setDbUserData] = useState<DbUserData | null>(null)
  const [dbTripsData, setDbTripsData] = useState<DbTripData[] | null>(null)
  const [signupLoading, setSignupLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  // Googleログインボタンのスピナー表示処理を分けるため、あえてauthLoadingには含めない
  const authLoading = signupLoading || loginLoading || logoutLoading
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false)
  const [updateUserLoading, setUpdateUserLoading] = useState(false)
  const [deleteUserLoading, setDeleteUserLoading] = useState(false)
  const anyLoading =
    authLoading ||
    resetPasswordLoading ||
    updateUserLoading ||
    deleteUserLoading
  const [redirectResultFetched, setRedirectResultFetched] = useState(true)
  const [firstLogin, setFirstLogin] = useState(false)

  const router = useRouter()
  const { showToast } = useToast()

  // 新規登録処理
  const signup = async (email: string, password: string, username: string) => {
    setSignupLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      const idToken = await user.getIdToken()

      try {
        // ユーザー登録APIを実行
        await createUserAPI(idToken, { uid: user.uid, name: username })
      } catch (e) {
        await user.delete()
        showToast('error', CREATE_USER_ERROR_MSG)
        return
      }

      // 認証メールにユーザー名が表示されるように設定
      await updateProfile(user, {
        displayName: username,
      })
      await sendEmailVerification(user, {
        url: `${siteUrl}`,
      })

      // メール認証が完了するまでログアウトさせる
      await signOut(auth)

      showToast(
        'info',
        '登録はまだ完了していません。 確認メールをご確認ください。'
      )
      return user
    } catch (e) {
      const firebaseError = e as FirebaseError
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          showToast('error', 'このメールアドレスは既に使用されています。')
          break
        default:
          showToast('error', '新規登録に失敗しました。')
      }
    } finally {
      setSignupLoading(false)
    }
  }

  // ログイン処理
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setLoginLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const isNotVerified = !result.user.emailVerified

      // メールアドレスが認証済のユーザーのみログイン処理実行
      if (isNotVerified) {
        showToast(
          'error',
          'メールアドレスが未認証です。確認メールをご確認ください。'
        )
        await signOut(auth)
      } else {
        const user = result.user

        // ユーザー情報取得APIを実行して初めてのログインか確認
        const idToken = await user.getIdToken()
        const dbUserData = await getUserAPI(idToken, user.uid)
        const isFirstLogin = !dbUserData.last_login_time
        setDbUserData(dbUserData)
        setFirstLogin(isFirstLogin)

        // ユーザー情報更新APIを実行してログイン時間を保存
        const now = getDatetimeTimestamp()
        await updateUserAPI(idToken, {
          uid: user.uid,
          last_login_time: now,
        })

        // 旅行プラン取得APIを実行してデータを保存
        const dbTripsData = await getTripsAPI(idToken, user.uid)
        setDbTripsData(dbTripsData)

        // ユーザー情報を保存して、ルートパスに遷移
        setCurrentUser(user)
        await router.push('/')
        showToast(
          'success',
          isFirstLogin ? 'HayabusaTripへようこそ！' : 'ログインしました。'
        )
        return user
      }
    } catch (e) {
      if (e instanceof Error) {
        switch (e.message) {
          case GET_USER_ERROR_MSG:
            showToast('error', GET_USER_ERROR_MSG)
            break
          case UPDATE_USER_ERROR_MSG:
            showToast('error', UPDATE_USER_ERROR_MSG)
            break
          default:
            showToast('error', 'メールアドレスまたはパスワードが不正です。')
        }
      } else {
        showToast('error', '予期しないエラーが発生しました。')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  // Googleログイン処理
  const loginWithGoogle = async () => {
    setGoogleLoginLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithRedirect(auth, provider)
    } catch (e) {
      showToast('error', 'アカウントが見つかりません。')
    } finally {
      setGoogleLoginLoading(false)
    }
  }

  // ログアウト処理
  const logout = async () => {
    setLogoutLoading(true)
    try {
      await signOut(auth)
      setCurrentUser(null)
      await router.push('/')
      showToast('success', 'ログアウトしました。')
    } catch (e) {
      showToast('error', 'ログアウトに失敗しました。')
    } finally {
      setLogoutLoading(false)
    }
  }

  // Googleログインリダイレクト後の処理
  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        setRedirectResultFetched(true)
        const result = await getRedirectResult(auth)
        if (result) {
          const user = result.user

          // getUserAPIを実行してログインユーザーの存在確認
          const idToken = await user.getIdToken()
          let dbUserData = await getUserAPI(idToken, user.uid)
          const displayName = user.displayName || '新規ユーザー'
          const photoURL = user.photoURL || '/images/default-user-icon.png'
          const isFirstLogin = !dbUserData

          // DBにユーザーが存在しない場合、trueを設定
          setFirstLogin(isFirstLogin)

          // DBにユーザーが存在しない場合、新規ユーザーを作成
          if (!dbUserData) {
            dbUserData = await createUserAPI(idToken, {
              uid: user.uid,
              name: displayName,
              icon_path: photoURL,
            })
          }
          setDbUserData(dbUserData)

          // updateUserAPIを実行してログイン時間を保存
          const now = getDatetimeTimestamp()
          await updateUserAPI(idToken, {
            uid: user.uid,
            last_login_time: now,
          })

          // 旅行プラン取得APIを実行してデータを保存
          const dbTripsData = await getTripsAPI(idToken, user.uid)
          setDbTripsData(dbTripsData)

          // ユーザー情報を保存して、ルートパスに遷移
          setCurrentUser(user)
          await router.push('/')
          showToast(
            'success',
            isFirstLogin
              ? 'HayabusaTripへようこそ！'
              : 'Googleアカウントでログインしました。'
          )
        }
      } catch (e) {
        if (e instanceof Error) {
          switch (e.message) {
            case GET_USER_ERROR_MSG:
              showToast('error', GET_USER_ERROR_MSG)
              break
            case CREATE_USER_ERROR_MSG:
              showToast('error', CREATE_USER_ERROR_MSG)
              break
            case UPDATE_USER_ERROR_MSG:
              showToast('error', UPDATE_USER_ERROR_MSG)
              break
            default:
              showToast('error', 'アカウントが見つかりません。')
          }
        } else {
          showToast('error', '予期しないエラーが発生しました。')
        }
      } finally {
        setRedirectResultFetched(false)
      }
    }
    fetchRedirectResult()
  }, [router, showToast, firstLogin])

  // パスワード再設定のメール送信処理
  const resetPassword = async (email: string): Promise<boolean> => {
    setResetPasswordLoading(true)
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${siteUrl}`,
      })
      showToast('info', 'パスワード再設定用のメールを送信しました。')
      return true
    } catch (e) {
      const firebaseError = e as FirebaseError
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          showToast('error', '無効なメールアドレスです。')
          break
        case 'auth/user-not-found':
          showToast('error', 'このメールアドレスのユーザーが見つかりません。')
          break
        default:
          showToast('error', 'パスワード再設定用のメールの送信に失敗しました。')
      }
      return false
    } finally {
      setResetPasswordLoading(false)
    }
  }

  // ユーザー情報の更新処理
  const updateUser = async (newUsername: string, newEmail: string) => {
    if (!dbUserData || !currentUser) {
      showToast('error', 'ユーザー情報が不正です。')
      return
    }

    const usernameChanged = newUsername !== dbUserData.name
    const emailChanged = newEmail !== currentUser.email

    if (!usernameChanged && !emailChanged) {
      showToast('info', 'ユーザー情報が変更されていません。')
      return
    }

    setUpdateUserLoading(true)

    let usernameUpdateSuccess = true
    let emailUpdateSuccess = true

    if (usernameChanged) {
      try {
        const idToken = await currentUser.getIdToken()
        const updateDbUserData = await updateUserAPI(idToken, {
          uid: currentUser.uid,
          name: newUsername,
        })
        setDbUserData(updateDbUserData)
      } catch (e) {
        usernameUpdateSuccess = false
      }
    }

    if (emailChanged) {
      try {
        // 認証メールにユーザー名が表示されるように設定
        await updateProfile(currentUser, {
          displayName: newUsername,
        })
        await updateEmail(currentUser, newEmail)
      } catch (e) {
        emailUpdateSuccess = false
      }
    }

    setUpdateUserLoading(false)

    if (usernameChanged && emailChanged) {
      if (usernameUpdateSuccess && emailUpdateSuccess) {
        showToast('success', 'ユーザー情報を更新しました。')
      } else {
        showToast('error', 'ユーザー情報の更新に失敗しました。')
      }
    } else if (usernameChanged) {
      if (usernameUpdateSuccess) {
        showToast('success', 'ユーザー名を更新しました。')
      } else {
        showToast('error', 'ユーザー名の更新に失敗しました。')
      }
    } else if (emailChanged) {
      if (emailUpdateSuccess) {
        showToast('success', 'メールアドレスを更新しました。')
      } else {
        showToast('error', 'メールアドレスの更新に失敗しました。')
      }
    }
  }

  const deleteUser = async () => {
    if (!currentUser) {
      showToast('error', 'ログインしてください。')
      return false
    }

    setDeleteUserLoading(true)

    try {
      // ユーザー削除APIを実行
      const idToken = await currentUser.getIdToken()
      await deleteUserAPI(idToken, currentUser.uid)

      // Firebaseからユーザー情報を削除
      await currentUser.delete()
      setCurrentUser(null)
      await router.push('/')
      showToast('success', '退会が完了しました。ご利用ありがとうございました。')
      return true
    } catch (e) {
      if (e instanceof Error) {
        switch (e.message) {
          case DELETE_USER_ERROR_MSG:
            showToast('error', DELETE_USER_ERROR_MSG)
            break
          default:
            showToast('error', '退会に失敗しました。')
        }
      } else {
        showToast('error', '予期しないエラーが発生しました。')
      }
      return false
    } finally {
      setDeleteUserLoading(false)
    }
  }

  // リアルタイムで認証状態の変更を監視し、ログイン状態を保持
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)

        try {
          const fetchData = async () => {
            const idToken = await user.getIdToken()
            const dbUserData = await getUserAPI(idToken, user.uid)
            setDbUserData(dbUserData)
            const dbTripsData = await getTripsAPI(idToken, user.uid)
            setDbTripsData(dbTripsData)
          }

          fetchData()
        } catch (e) {
          showToast('error', GET_USER_ERROR_MSG)
        }
      } else {
        setCurrentUser(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [showToast])

  return {
    currentUser,
    dbUserData,
    dbTripsData,
    signupLoading,
    loginLoading,
    googleLoginLoading,
    logoutLoading,
    authLoading,
    resetPasswordLoading,
    updateUserLoading,
    deleteUserLoading,
    anyLoading,
    redirectResultFetched,
    firstLogin,
    signup,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUser,
    deleteUser,
    setDbTripsData,
  }
}
