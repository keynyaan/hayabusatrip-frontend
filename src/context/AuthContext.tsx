import type { User } from 'firebase/auth'
import { createContext, useContext, useState } from 'react'
import { DbSpotData } from '@/api/spotApi'
import { DbTripData } from '@/api/tripApi'
import { DbUserData } from '@/api/userApi'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

// AuthContextのインターフェース定義
interface AuthContext {
  currentUser: User | null | undefined
  dbUserData: DbUserData | null
  dbTripsData: DbTripData[] | null
  selectedTrip: DbTripData | null
  tripApiLoading: boolean
  dbSpotsData: DbSpotData[] | null
  selectedSpot: DbSpotData | null
  spotApiLoading: boolean
  S3ApiLoading: boolean
  signupLoading: boolean
  loginLoading: boolean
  googleLoginLoading: boolean
  logoutLoading: boolean
  authLoading: boolean
  resetPasswordLoading: boolean
  updateUserLoading: boolean
  deleteUserLoading: boolean
  firstLogin: boolean
  userIconPath: string

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
  setDbTripsData: (dbTripsData: DbTripData[]) => void
  setSelectedTrip: (selectedTrip: DbTripData | null) => void
  setTripApiLoading: (tripApiLoading: boolean) => void
  setDbSpotsData: (dbSpotsData: DbSpotData[]) => void
  setSelectedSpot: (selectedSpot: DbSpotData | null) => void
  setSpotApiLoading: (spotApiLoading: boolean) => void
  setS3ApiLoading: (S3ApiLoading: boolean) => void
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
  const [selectedTrip, setSelectedTrip] = useState<DbTripData | null>(null)
  const [tripApiLoading, setTripApiLoading] = useState(false)
  const [dbSpotsData, setDbSpotsData] = useState<DbSpotData[] | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<DbSpotData | null>(null)
  const [spotApiLoading, setSpotApiLoading] = useState(false)
  const [S3ApiLoading, setS3ApiLoading] = useState(false)

  // AuthContextオブジェクトの定義
  const AuthContext: AuthContext = {
    currentUser,
    dbUserData,
    dbTripsData,
    selectedTrip,
    tripApiLoading,
    dbSpotsData,
    selectedSpot,
    spotApiLoading,
    S3ApiLoading,
    signupLoading,
    loginLoading,
    googleLoginLoading,
    logoutLoading,
    authLoading,
    resetPasswordLoading,
    updateUserLoading,
    deleteUserLoading,
    firstLogin,
    userIconPath,
    signup,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUser,
    deleteUser,
    setUserIconPath,
    setDbTripsData,
    setSelectedTrip,
    setTripApiLoading,
    setDbSpotsData,
    setSelectedSpot,
    setSpotApiLoading,
    setS3ApiLoading,
  }

  return <AuthCtx.Provider value={AuthContext}>{children}</AuthCtx.Provider>
}

// ユーザー情報共有用の関数
export const useAuthContext = () => useContext(AuthCtx)
