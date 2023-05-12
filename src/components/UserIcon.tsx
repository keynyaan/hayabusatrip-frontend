import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { updateUserAPI } from '@/api/userApi'
import { useToast } from '@/context/ToastContext'
import {
  FILE_SIZE_LIMIT_BYTES,
  FILE_SIZE_LIMIT_MB,
  HEADER_USER_ICON_HEIGHT,
  HEADER_USER_ICON_WIDTH,
  SETTINGS_USER_ICON_HEIGHT,
  SETTINGS_USER_ICON_WIDTH,
} from '@/utils/constants'

type UserIconProps = {
  isSettingsPage?: boolean
}

export const UserIcon: React.FC<UserIconProps> = ({ isSettingsPage }) => {
  const { currentUser, dbUserData, logout, userIconPath, setUserIconPath } =
    useAuthContext()

  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { showToast } = useToast()

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

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClickIcon = () => {
    if (isSettingsPage) {
      fileInputRef.current?.click()
    } else {
      toggleDropdown()
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const file = event.target.files[0]

    if (!dbUserData || !currentUser) {
      showToast('error', 'ユーザー情報が不正です。')
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast('error', '画像ファイルを選択してください。')
      return
    }

    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      showToast(
        'error',
        `画像ファイルのサイズは${FILE_SIZE_LIMIT_MB}MB以下にしてください。`
      )
      return
    }

    try {
      showToast('info', '画像を更新中です。')
      const idToken = await currentUser.getIdToken()
      const res = await updateUserAPI(idToken, { uid: dbUserData.uid }, file)
      setUserIconPath(res.icon_path)
      showToast('success', '画像を更新しました。')
    } catch (e) {
      showToast('error', '画像のアップロードに失敗しました。')
    }
  }

  useEffect(() => {
    if (dbUserData) {
      setUserIconPath(dbUserData.icon_path)
    }
  }, [dbUserData, setUserIconPath])

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
      {userIconPath !== '' && (
        <div
          style={{
            position: 'relative',
            width: isSettingsPage
              ? `${SETTINGS_USER_ICON_WIDTH}px`
              : `${HEADER_USER_ICON_WIDTH}px`,
            height: isSettingsPage
              ? `${SETTINGS_USER_ICON_HEIGHT}px`
              : `${HEADER_USER_ICON_HEIGHT}px`,
          }}
        >
          <Image
            src={userIconPath}
            alt="ユーザーのアイコン画像"
            onClick={handleClickIcon}
            width={
              isSettingsPage ? SETTINGS_USER_ICON_WIDTH : HEADER_USER_ICON_WIDTH
            }
            height={
              isSettingsPage
                ? SETTINGS_USER_ICON_HEIGHT
                : HEADER_USER_ICON_HEIGHT
            }
            className={`cursor-pointer rounded-full transition-opacity object-cover w-full h-full ${
              isHovered ? 'opacity-80' : ''
            }`}
            priority={isSettingsPage}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {isSettingsPage && (
            <div
              className="cursor-pointer absolute bottom-0 right-0 bg-brand-color rounded-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FontAwesomeIcon
                icon={faCamera}
                className="p-1 text-white"
                onClick={handleClickIcon}
                size="lg"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
      {isDropdownVisible && (
        <div className="absolute z-15 bg-white text-gray-700 rounded shadow right-0 mt-2">
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
