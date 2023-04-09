import { useState, useEffect } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { useRouter } from 'next/router'
import { auth } from 'initFirebase'
import { toast } from 'react-toastify'

export default function useFirebaseAuth() {
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
    logout,
  }
}
