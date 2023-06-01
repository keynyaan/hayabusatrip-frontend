import type { User } from 'firebase/auth'
import { createContext, useContext, useState } from 'react'
import { DbUserData } from '@/api/userApi'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { DbTripData } from '@/api/tripApi'

// AuthContextのインターフェース定義
interface AuthContext {
  currentUser: User | null | undefined
  dbUserData: DbUserData | null
  dbTripsData: DbTripData[] | null
  signupLoading: boolean
  loginLoading: boolean
  googleLoginLoading: boolean
  logoutLoading: boolean
  authLoading: boolean
  resetPasswordLoading: boolean
  updateUserLoading: boolean
  deleteUserLoading: boolean
  anyLoading: boolean
  redirectResultFetched: boolean
  firstLogin: boolean
  userIconPath: string
  tripApiLoading: boolean
  selectedTrip: DbTripData | null

  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<User | undefined>
  loginWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<User | undefined>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
  updateUser: (newUsername: string, newEmail: string) => Promise<void>
  deleteUser: () => Promise<boolean>
  setUserIconPath: (path: string) => void
  setTripApiLoading: (tripApiLoading: boolean) => void
  setDbTripsData: (dbTripsData: DbTripData[]) => void
  setSelectedTrip: (selectedTrip: DbTripData | null) => void
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
  } = useFirebaseAuth()

  const [userIconPath, setUserIconPath] = useState('')
  const [tripApiLoading, setTripApiLoading] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<DbTripData | null>(null)

  // AuthContextオブジェクトの定義
  const AuthContext: AuthContext = {
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
    userIconPath,
    tripApiLoading,
    selectedTrip,
    signup,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUser,
    deleteUser,
    setUserIconPath,
    setTripApiLoading,
    setDbTripsData,
    setSelectedTrip,
  }

  return <AuthCtx.Provider value={AuthContext}>{children}</AuthCtx.Provider>
}

// ユーザー情報共有用の関数
export const useAuthContext = () => useContext(AuthCtx)
