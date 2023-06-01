import React, { useState } from 'react'
import Image from 'next/image'
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
  FORM_TRIP_PUBLISH_SETTINGS,
  TRIP_DESTINATION_ITEMS,
} from '@/utils/constants'
import { formatDate } from '@/utils/getDate'

type TripCardProps = {
  trip: DbTripData
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const { setSelectedTrip } = useAuthContext()
  const { dropdownRef, isDropdownVisible, hideDropdown, toggleDropdown } =
    useDropdown()

  const [tripPublishSettingsOpen, setTripPublishSettingsOpen] = useState(false)
  const [copyTripOpen, setCopyTripOpen] = useState(false)
  const [deleteTripOpen, setDeleteTripOpen] = useState(false)

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
    setSelectedTrip(null)
    setOpenModal(false)
  }

  return (
    <div
      className="rounded-xl shadow-md overflow-hidden"
      key={trip.id}
      ref={dropdownRef}
    >
      <div className="relative pb-[66.666667%]">
        <Image
          src={trip.image_path}
          alt={`${trip.title}の旅行画像`}
          fill
          priority={true}
          className="object-cover"
        />
        <div
          className="absolute top-0 right-0 m-2 w-10 h-10 rounded-full bg-gray-500 bg-opacity-80 hover:bg-opacity-60 transition p-1 flex items-center justify-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <FontAwesomeIcon icon={faEllipsis} className="text-white text-2xl" />
        </div>
        <DropdownMenu isVisible={isDropdownVisible}>
          <DropdownMenuButton
            onClick={() => onOpenModal(setTripPublishSettingsOpen)}
            label="公開設定"
          />
          <DropdownMenuButton
            onClick={() => onOpenModal(setCopyTripOpen)}
            label="コピー"
          />
          <DropdownMenuButton
            onClick={() => onOpenModal(setDeleteTripOpen)}
            label="削除"
            className="text-red-500"
          />
        </DropdownMenu>
        {tripPublishSettingsOpen && (
          <TripCardModal
            open={tripPublishSettingsOpen}
            onClose={() => onCloseModal(setTripPublishSettingsOpen)}
            form={FORM_TRIP_PUBLISH_SETTINGS}
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
      </div>
      <div className="px-4 py-2 text-gray-700">
        <div className="flex items-center mb-2 text-sm">
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
    </div>
  )
}
