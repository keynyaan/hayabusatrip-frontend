import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { updateUserAPI } from '@/api/userApi'
import { DropdownMenu } from '@/components/DropdownMenu'
import { DropdownMenuButton } from '@/components/DropdownMenuButton'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDropdown } from '@/hooks/useDropdown'
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
  const { dropdownRef, isDropdownVisible, hideDropdown, toggleDropdown } =
    useDropdown()

  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { showToast } = useToast()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

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
      <DropdownMenu isVisible={isDropdownVisible}>
        <Link href="/settings">
          <DropdownMenuButton onClick={hideDropdown} label="アカウント設定" />
        </Link>
        <DropdownMenuButton onClick={handleLogout} label="ログアウト" />
      </DropdownMenu>
    </div>
  )
}
