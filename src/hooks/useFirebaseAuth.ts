import {
  signInWithEmailAndPassword,
  signOut,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { auth } from '@/../initFirebase'
import { useToast } from '@/context/ToastContext'

export const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [redirectResultFetched, setRedirectResultFetched] = useState(false)

  const router = useRouter()

  const { showToast } = useToast()

  // ログイン処理
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      if (result) {
        console.log(result)
        const user = result.user
        setCurrentUser(user)
        await router.push('/')
        showToast('success', 'ログインしました。')
        setLoading(false)
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
      setLoading(false)
      await router.push('/')
      showToast('success', 'ログアウトしました。')
    } catch (e) {
      showToast('error', 'ログアウトに失敗しました。')
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
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
  }
}
