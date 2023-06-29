import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLock,
  faUnlock,
  faLocationDot,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons'
import type { DbTripData } from '@/api/tripApi'
import { DropdownMenu } from '@/components/DropdownMenu'
import { DropdownMenuButton } from '@/components/DropdownMenuButton'
import { TripCardModal } from '@/components/TripCardModal'
import { useAuthContext } from '@/context/AuthContext'
import { useDropdown } from '@/hooks/useDropdown'
import {
  FORM_COPY_TRIP,
  FORM_DELETE_TRIP,
  FORM_TRIP_DESTINATION,
  FORM_TRIP_PHOTO,
  FORM_TRIP_PUBLISH_SETTINGS,
  FORM_TRIP_TITLE,
  TRIPS_URL,
  TRIP_DESTINATION_ITEMS,
} from '@/utils/constants'
import { formatDate } from '@/utils/getDate'

type TripCardProps = {
  trip: DbTripData | null
  isDetailPage?: boolean
}

export const TripCard: React.FC<TripCardProps> = ({ trip, isDetailPage }) => {
  const { dbUserData, setSelectedTrip } = useAuthContext()
  const { dropdownRef, isDropdownVisible, hideDropdown, toggleDropdown } =
    useDropdown()

  const [tripPhotoOpen, setTripPhotoOpen] = useState(false)
  const [tripPublishSettingsOpen, setTripPublishSettingsOpen] = useState(false)
  const [tripTitleOpen, setTripTitleOpen] = useState(false)
  const [tripDestinationOpen, setTripDestinationOpen] = useState(false)
  const [copyTripOpen, setCopyTripOpen] = useState(false)
  const [deleteTripOpen, setDeleteTripOpen] = useState(false)

  const isOwner = trip?.user_id === dbUserData?.id

  const onOpenModal = (
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    hideDropdown()
    setSelectedTrip(trip)
    setOpenModal(true)
  }

  const onCloseModal = (
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setOpenModal(false)
  }

  if (!trip) return null

  return (
    <div
      className={
        isDetailPage
          ? ''
          : 'rounded-xl overflow-hidden shadow-md hover:shadow-xl transition'
      }
      key={trip.id}
      ref={dropdownRef}
    >
      <div className="relative pb-[66.666667%]">
        {isDetailPage ? (
          <div className="absolute inset-0">
            <Image
              src={trip.image_path}
              alt={`${trip.title}の旅行画像`}
              fill
              priority={true}
              className="object-cover"
            />
          </div>
        ) : (
          <Link href={`${TRIPS_URL}/${trip.trip_token}`}>
            <div className="absolute inset-0">
              <Image
                src={trip.image_path}
                alt={`${trip.title}の旅行画像`}
                fill
                priority={true}
                className="object-cover"
              />
            </div>
          </Link>
        )}
        {isOwner && (
          <>
            <div
              className="absolute top-0 right-0 m-2 w-10 h-10 rounded-full bg-gray-500 bg-opacity-80 hover:bg-opacity-60 transition p-1 flex items-center justify-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <FontAwesomeIcon
                icon={faEllipsis}
                className="text-white text-2xl"
              />
            </div>
            <DropdownMenu isVisible={isDropdownVisible}>
              {isDetailPage && (
                <DropdownMenuButton
                  onClick={() => onOpenModal(setTripPhotoOpen)}
                  label="写真の変更"
                />
              )}
              <DropdownMenuButton
                onClick={() => onOpenModal(setTripPublishSettingsOpen)}
                label="公開状態の変更"
              />
              <DropdownMenuButton
                onClick={() => onOpenModal(setTripTitleOpen)}
                label="タイトルの変更"
              />
              <DropdownMenuButton
                onClick={() => onOpenModal(setTripDestinationOpen)}
                label="旅行先の変更"
              />
              {isDetailPage ?? (
                <DropdownMenuButton
                  onClick={() => onOpenModal(setCopyTripOpen)}
                  label="コピー"
                />
              )}
              <DropdownMenuButton
                onClick={() => onOpenModal(setDeleteTripOpen)}
                label="削除"
                className="text-red-500"
              />
            </DropdownMenu>
            {tripPhotoOpen && (
              <TripCardModal
                open={tripPhotoOpen}
                onClose={() => onCloseModal(setTripPhotoOpen)}
                form={FORM_TRIP_PHOTO}
              />
            )}
            {tripPublishSettingsOpen && (
              <TripCardModal
                open={tripPublishSettingsOpen}
                onClose={() => onCloseModal(setTripPublishSettingsOpen)}
                form={FORM_TRIP_PUBLISH_SETTINGS}
              />
            )}
            {tripTitleOpen && (
              <TripCardModal
                open={tripTitleOpen}
                onClose={() => onCloseModal(setTripTitleOpen)}
                form={FORM_TRIP_TITLE}
              />
            )}
            {tripDestinationOpen && (
              <TripCardModal
                open={tripDestinationOpen}
                onClose={() => onCloseModal(setTripDestinationOpen)}
                form={FORM_TRIP_DESTINATION}
              />
            )}
            {copyTripOpen && (
              <TripCardModal
                open={copyTripOpen}
                onClose={() => onCloseModal(setCopyTripOpen)}
                form={FORM_COPY_TRIP}
              />
            )}
            {deleteTripOpen && (
              <TripCardModal
                open={deleteTripOpen}
                onClose={() => onCloseModal(setDeleteTripOpen)}
                form={FORM_DELETE_TRIP}
              />
            )}
          </>
        )}
      </div>
      {isDetailPage ? (
        <div className="p-3 text-gray-700">
          <div className="flex justify-center items-center mb-2 text-lg">
            {isOwner && (
              <FontAwesomeIcon
                icon={trip.is_public ? faUnlock : faLock}
                className="mr-2"
              />
            )}
            <h3 className="font-bold">{trip.title}</h3>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-500">
              {formatDate(trip.start_date)}-{formatDate(trip.end_date)}
            </p>
            <span>
              <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
              {TRIP_DESTINATION_ITEMS[trip.prefecture_id - 1]?.name}
            </span>
          </div>
        </div>
      ) : (
        <Link href={`${TRIPS_URL}/${trip.trip_token}`}>
          <div className="p-3 text-gray-700">
            <div className="flex justify-center items-center mb-2 text-sm">
              <FontAwesomeIcon
                icon={trip.is_public ? faUnlock : faLock}
                className="mr-2"
              />
              <h3 className="overflow-hidden whitespace-nowrap text-ellipsis font-bold">
                {trip.title}
              </h3>
            </div>
            <div className="flex justify-between text-xs">
              <p className="text-gray-500">
                {formatDate(trip.start_date)}-{formatDate(trip.end_date)}
              </p>
              <span>
                <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                {TRIP_DESTINATION_ITEMS[trip.prefecture_id - 1]?.name}
              </span>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
