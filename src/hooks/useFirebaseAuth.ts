import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { auth } from '@/../initFirebase'

export const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ログイン処理
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      if (result) {
        const user = result.user
        router.push('/')
        return user
      }
    } catch (e) {
      toast.error('ログインできませんでした。')
    }
  }

  // Googleログイン処理
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      if (result) {
        const user = result.user
        router.push('/')
        return user
      }
    } catch (e) {
      toast.error('Googleログインできませんでした。')
    }
  }

  // ログアウト処理
  const clear = () => {
    setCurrentUser(null)
    setLoading(false)
  }

  const logout = () => signOut(auth).then(clear)

  // ユーザーの状態管理用パラメータの設定
  const nextOrObserver = async (user: User | null) => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setCurrentUser(user)
    setLoading(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, nextOrObserver)
    return unsubscribe
  }, [])

  return {
    currentUser,
    loading,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
  }
}
