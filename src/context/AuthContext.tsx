import type { User } from 'firebase/auth'
import { createContext, useContext } from 'react'

import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { DbUserData } from '@/api/userApi'

// AuthContextのインターフェース定義
interface AuthContext {
  currentUser: User | null | undefined
  dbUserData: DbUserData | null
  loading: boolean
  googleLoading: boolean
  redirectResultFetched: boolean
  firstLogin: boolean
  setLoading: (loading: boolean) => void
  setGoogleLoading: (loading: boolean) => void
  setRedirectResultFetched: (loading: boolean) => void
  setFirstLogin: (firstLogin: boolean) => void

  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<User | undefined>
  verifyEmail: (oobCode: string) => Promise<void>
  loginWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<User | undefined>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
  updateUser: (newUsername: string, newEmail: string) => Promise<void>
}

// AuthContextProviderのProps型の定義
type AuthProviderProps = {
  children: React.ReactNode
}

// ユーザー情報共有用のコンテキスト「AuthCtx」を作成
const AuthCtx = createContext({} as AuthContext)

// ユーザー情報共有用のコンポーネント
export function AuthContextProvider({ children }: AuthProviderProps) {
  // FirebaseAuthの状態を取得
  const {
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
    updateUser,
  } = useFirebaseAuth()

  // AuthContextオブジェクトの定義
  const AuthContext: AuthContext = {
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
    updateUser,
  }

  return <AuthCtx.Provider value={AuthContext}>{children}</AuthCtx.Provider>
}

// ユーザー情報共有用の関数
export const useAuthContext = () => useContext(AuthCtx)
