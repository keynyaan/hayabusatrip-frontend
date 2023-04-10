import type { User } from 'firebase/auth'
import { createContext, useContext } from 'react'

import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

// AuthContextのインターフェース定義
interface AuthContext {
  currentUser: User | null
  loading: boolean
  loginWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<User | undefined>
  loginWithGoogle: () => Promise<User | undefined>
  logout: () => Promise<void>
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
    loading,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
  } = useFirebaseAuth()

  // AuthContextオブジェクトの定義
  const AuthContext: AuthContext = {
    currentUser,
    loading,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
  }

  return <AuthCtx.Provider value={AuthContext}>{children}</AuthCtx.Provider>
}

// ユーザー情報共有用の関数
export const useAuthContext = () => useContext(AuthCtx)
