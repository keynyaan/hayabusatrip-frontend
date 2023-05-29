import React from 'react'
import Image from 'next/image'
import { formatDate } from '@/utils/getDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLock,
  faLockOpen,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'
import { TRIP_DESTINATION_ITEMS } from '@/utils/constants'
import type { DbTripData } from '@/api/tripApi'

type TripCardProps = {
  trip: DbTripData
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => (
  <div className="rounded-xl shadow-md overflow-hidden" key={trip.id}>
    <div className="relative pb-[66.666667%]">
      <Image
        src={trip.image_path}
        alt={`${trip.title}の旅行画像`}
        fill
        priority={true}
        className="object-cover"
      />
    </div>
    <div className="px-4 py-2 text-gray-700">
      <div className="flex items-center mb-2">
        <FontAwesomeIcon
          icon={trip.is_public ? faLockOpen : faLock}
          className="mr-2"
        />
        <h3 className="overflow-hidden whitespace-nowrap text-ellipsis">
          {trip.title}
        </h3>
      </div>
      <div className="flex justify-between text-sm">
        <p>
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
