import {
  signInWithEmailAndPassword,
  signOut,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
  createUserWithEmailAndPassword,
  applyActionCode,
  sendEmailVerification,
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
import { DbUserData, getUser, createUser, updateUser } from '@/api/userApi'
import {
  siteMeta,
  GET_USER_ERROR_MSG,
  CREATE_USER_ERROR_MSG,
  UPDATE_USER_ERROR_MSG,
} from '@/utils/constants'

export const useFirebaseAuth = () => {
  const { siteUrl } = siteMeta

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [dbUserData, setDbUserData] = useState<DbUserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [redirectResultFetched, setRedirectResultFetched] = useState(true)
  const [firstLogin, setFirstLogin] = useState(false)

  const router = useRouter()
  const { showToast } = useToast()

  // 新規登録処理
  const signup = async (email: string, password: string, username: string) => {
    setLoading(true)
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
        await createUser(idToken, { uid: user.uid, name: username })
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
      setLoading(false)
    }
  }

  // アドレス認証処理(Firebaseのデフォルトの機能ではなく、カスタマイズする必要が出てきたら使う)
  const verifyEmail = async (oobCode: string) => {
    setLoading(true)
    try {
      await applyActionCode(auth, oobCode)
      showToast('success', 'メールアドレスの認証に成功しました。')
    } catch (e) {
      const firebaseError = e as FirebaseError
      switch (firebaseError.code) {
        case 'auth/expired-action-code':
          showToast('error', '認証コードが期限切れです。')
          break
        case 'auth/invalid-action-code':
          showToast('error', '無効な認証コードです。')
          break
        default:
          showToast('error', 'メールアドレスの認証に失敗しました。')
      }
    } finally {
      setLoading(false)
    }
  }

  // ログイン処理
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setLoading(true)
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
        const dbUserData = await getUser(idToken, user.uid)
        const isFirstLogin = !dbUserData.last_login_time
        setDbUserData(dbUserData)

        // ユーザー情報更新APIを実行してログイン時間を保存
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
        await updateUser(idToken, {
          uid: user.uid,
          last_login_time: now,
        })

        setFirstLogin(isFirstLogin)
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
            showToast('error', '予期しないエラーが発生しました。')
        }
      } else {
        showToast('error', 'メールアドレスまたはパスワードが不正です。')
      }
    } finally {
      setLoading(false)
    }
  }

  // Googleログイン処理
  const loginWithGoogle = async () => {
    setGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithRedirect(auth, provider)
    } catch (e) {
      showToast('error', 'アカウントが見つかりません。')
    } finally {
      setGoogleLoading(false)
    }
  }

  // ログアウト処理
  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setCurrentUser(null)
      await router.push('/')
      showToast('success', 'ログアウトしました。')
    } catch (e) {
      showToast('error', 'ログアウトに失敗しました。')
    } finally {
      setLoading(false)
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
          let dbUserData = await getUser(idToken, user.uid)
          const displayName = user.displayName || '新規ユーザー'
          const photoURL = user.photoURL || '/images/default-user-icon.png'
          const isFirstLogin = !dbUserData

          // DBにユーザーが存在しない場合、新規ユーザーを作成
          if (!dbUserData) {
            dbUserData = await createUser(idToken, {
              uid: user.uid,
              name: displayName,
              icon_path: photoURL,
            })
          }
          setDbUserData(dbUserData)

          // updateUserAPIを実行してログイン時間を保存
          const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
          await updateUser(idToken, {
            uid: user.uid,
            last_login_time: now,
          })
          setFirstLogin(isFirstLogin)
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
              showToast('error', '予期しないエラーが発生しました。')
          }
        } else {
          showToast('error', 'アカウントが見つかりません。')
        }
      } finally {
        setRedirectResultFetched(false)
      }
    }
    fetchRedirectResult()
  }, [router, showToast, firstLogin])

  // パスワード再設定のメール送信処理
  const resetPassword = async (email: string): Promise<boolean> => {
    setLoading(true)
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
      setLoading(false)
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
            const dbUserData = await getUser(idToken, user.uid)
            setDbUserData(dbUserData)
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
    loading,
    googleLoading,
    redirectResultFetched,
    firstLogin,
    setLoading,
    setGoogleLoading,
    setRedirectResultFetched,
    setFirstLogin,
    signup,
    verifyEmail,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword,
  }
}
