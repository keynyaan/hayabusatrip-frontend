import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/context/AuthContext'

export const UserIcon: React.FC = () => {
  const { currentUser, dbUserData, logout } = useAuthContext()

  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible)
  }

  useEffect(() => {
    if (currentUser) {
      setIsDropdownVisible(false)
    }
  }, [currentUser])

  return (
    <div className="relative">
      {dbUserData && (
        <>
          <Image
            src={dbUserData.icon_path}
            alt="ユーザーのアイコン画像"
            onClick={toggleDropdown}
            className="cursor-pointer  rounded-full"
            width={50}
            height={50}
          />
        </>
      )}
      {isDropdownVisible && (
        <div className="absolute z-15 bg-white text-gray-700 rounded shadow right-0 mt-2 ">
          <Link href="/settings">
            <button className="whitespace-nowrap p-3 w-full text-left hover:bg-gray-100 transition-colors">
              アカウント設定
            </button>
          </Link>
          <button
            onClick={logout}
            className="whitespace-nowrap p-3 w-full text-left hover:bg-gray-100 transition-colors"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}
