import type { User } from 'firebase/auth'
import { ChangeEvent, createContext, useContext, useState } from 'react'
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
  deleteAccountLoading: boolean
  authStateChangedLoading: boolean
  firstLogin: boolean
  dateFilter: { year: string; month: string; day: string }
  destinationFilter: string
  statusFilter: string
  filteredData: DbTripData[] | null

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
  deleteAccount: () => Promise<boolean>
  setDbUserData: (dbUsersData: DbUserData) => void
  setDbTripsData: (dbTripsData: DbTripData[]) => void
  setSelectedTrip: (selectedTrip: DbTripData | null) => void
  setTripApiLoading: (tripApiLoading: boolean) => void
  setDbSpotsData: (dbSpotsData: DbSpotData[]) => void
  setSelectedSpot: (selectedSpot: DbSpotData | null) => void
  setSpotApiLoading: (spotApiLoading: boolean) => void
  setS3ApiLoading: (S3ApiLoading: boolean) => void
  handleDateFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleDestinationFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleStatusFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void
  clearFilter: () => void
  setFilteredData: (dbTripsData: DbTripData[] | null) => void
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
    deleteAccountLoading,
    authStateChangedLoading,
    firstLogin,
    signup,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUser,
    deleteAccount,
    setDbUserData,
    setDbTripsData,
  } = useFirebaseAuth()

  const [selectedTrip, setSelectedTrip] = useState<DbTripData | null>(null)
  const [tripApiLoading, setTripApiLoading] = useState(false)
  const [dbSpotsData, setDbSpotsData] = useState<DbSpotData[] | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<DbSpotData | null>(null)
  const [spotApiLoading, setSpotApiLoading] = useState(false)
  const [S3ApiLoading, setS3ApiLoading] = useState(false)
  const [dateFilter, setDateFilter] = useState({ year: '', month: '', day: '' })
  const [destinationFilter, setDestinationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [filteredData, setFilteredData] = useState<DbTripData[] | null>(
    dbTripsData || null
  )

  const handleDateFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleDestinationFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDestinationFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const clearFilter = () => {
    handleDateFilterChange({
      target: { name: 'year', value: '' },
    } as React.ChangeEvent<HTMLSelectElement>)
    handleDateFilterChange({
      target: { name: 'month', value: '' },
    } as React.ChangeEvent<HTMLSelectElement>)
    handleDateFilterChange({
      target: { name: 'day', value: '' },
    } as React.ChangeEvent<HTMLSelectElement>)
    handleDestinationFilterChange({
      target: { value: '' },
    } as React.ChangeEvent<HTMLSelectElement>)
    handleStatusFilterChange({
      target: { value: '' },
    } as React.ChangeEvent<HTMLSelectElement>)
  }

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
    deleteAccountLoading,
    authStateChangedLoading,
    firstLogin,
    dateFilter,
    destinationFilter,
    statusFilter,
    filteredData,
    signup,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUser,
    deleteAccount,
    setDbUserData,
    setDbTripsData,
    setSelectedTrip,
    setTripApiLoading,
    setDbSpotsData,
    setSelectedSpot,
    setSpotApiLoading,
    setS3ApiLoading,
    handleDateFilterChange,
    handleDestinationFilterChange,
    handleStatusFilterChange,
    clearFilter,
    setFilteredData,
  }

  return <AuthCtx.Provider value={AuthContext}>{children}</AuthCtx.Provider>
}

// ユーザー情報共有用の関数
export const useAuthContext = () => useContext(AuthCtx)
