import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/context/AuthContext'

export const UserIcon: React.FC = () => {
  const { currentUser, dbUserData, logout } = useAuthContext()

  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const hideDropdown = () => {
    setIsDropdownVisible(false)
  }

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible)
  }

  const handleLogout = () => {
    hideDropdown()
    logout()
  }

  useEffect(() => {
    if (currentUser) {
      hideDropdown()
    }
  }, [currentUser])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        hideDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <div className="relative" ref={dropdownRef}>
      {dbUserData && (
        <>
          <Image
            src={dbUserData.icon_path}
            alt="ユーザーのアイコン画像"
            onClick={toggleDropdown}
            className="cursor-pointer  rounded-full hover:opacity-80 transition-opacity"
            width={50}
            height={50}
          />
        </>
      )}
      {isDropdownVisible && (
        <div className="absolute z-15 bg-white text-gray-700 rounded shadow right-0 mt-2 ">
          <Link href="/settings">
            <button
              onClick={hideDropdown}
              className="whitespace-nowrap p-3 w-full text-left hover:bg-gray-100 transition-colors"
            >
              アカウント設定
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="whitespace-nowrap p-3 w-full text-left hover:bg-gray-100 transition-colors"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}
