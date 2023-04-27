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
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { auth } from '@/../initFirebase'
import { useToast } from '@/context/ToastContext'
import { siteMeta } from '@/utils/constants'

export const useFirebaseAuth = () => {
  const { siteUrl } = siteMeta

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [redirectResultFetched, setRedirectResultFetched] = useState(false)

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

      await updateProfile(user, {
        displayName: username,
      })

      await sendEmailVerification(user, {
        url: `${siteUrl}`,
      })

      showToast(
        'success',
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

      if (isNotVerified) {
        showToast(
          'error',
          'メールアドレスが未認証です。確認メールをご確認ください。'
        )
        await signOut(auth)
      } else {
        const user = result.user
        setCurrentUser(user)
        await router.push('/')
        showToast('success', 'ログインしました。')
        return user
      }
    } catch (e) {
      showToast('error', 'メールアドレスまたはパスワードが不正です。')
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

  useEffect(() => {
    // Googleログインリダイレクト後の処理
    const fetchRedirectResult = async () => {
      try {
        setRedirectResultFetched(true)
        const result = await getRedirectResult(auth)
        if (result) {
          const user = result.user
          setCurrentUser(user)
          await router.push('/')
          showToast('success', 'Googleアカウントでログインしました。')
        }
      } catch (e) {
        showToast('error', 'アカウントが見つかりません。')
      } finally {
        setRedirectResultFetched(false)
      }
    }

    fetchRedirectResult()
  }, [router, showToast])

  return {
    currentUser,
    loading,
    googleLoading,
    redirectResultFetched,
    setLoading,
    setGoogleLoading,
    setRedirectResultFetched,
    signup,
    verifyEmail,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
  }
}
