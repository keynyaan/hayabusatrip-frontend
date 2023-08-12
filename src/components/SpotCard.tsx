import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import type { DbSpotData } from '@/api/spotApi'
import { SpotForm } from '@/components/SpotForm'
import { DeleteSpotForm } from '@/components/DeleteSpot'
import { Modal } from '@/components/Modal'
import { useAuthContext } from '@/context/AuthContext'
import {
  FORM_UPDATE_SPOT,
  FORM_DELETE_SPOT,
  SPOT_CATEGORY_OPTIONS,
  SPOT_FORM_MODE_UPDATE,
} from '@/utils/constants'
import { getTimeFromString } from '@/utils/getDate'

type SpotCardProps = {
  spot: DbSpotData
  viewMode: boolean
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, viewMode }) => {
  const { setSelectedSpot } = useAuthContext()
  const [deleteSpotModalOpen, setDeleteSpotModalOpen] = useState(false)
  const [updateSpotModalOpen, setUpdateSpotModalOpen] = useState(false)

  const spotCategory =
    SPOT_CATEGORY_OPTIONS.find((option) => option.value === spot.category) ||
    SPOT_CATEGORY_OPTIONS[0]

  const onOpenDeleteSpotModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setSelectedSpot(spot)
    setDeleteSpotModalOpen(true)
  }

  const onOpenUpdateSpotModal = () => {
    setSelectedSpot(spot)
    setUpdateSpotModalOpen(true)
  }

  const onCloseDeleteSpotModal = () => {
    setSelectedSpot(null)
    setDeleteSpotModalOpen(false)
  }

  const onCloseUpdateSpotModal = () => {
    setSelectedSpot(null)
    setUpdateSpotModalOpen(false)
  }

  return (
    <>
      <div
        className={`relative p-3 pr-6 rounded shadow-md bg-white ${
          viewMode ? '' : 'hover:shadow-xl transition cursor-pointer'
        }`}
        key={spot.id}
        onClick={viewMode ? undefined : onOpenUpdateSpotModal}
        data-testid="spot-card"
      >
        {!viewMode && (
          <div
            className="absolute top-0 right-0 w-6 h-6 transition p-2 text-red-500 hover:text-white rounded-full  hover:bg-red-500 flex items-center justify-center"
            onClick={onOpenDeleteSpotModal}
          >
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <div
            className={`flex flex-shrink-0 rounded-full w-8 h-8 items-center justify-center ${spotCategory.color}`}
          >
            <FontAwesomeIcon icon={spotCategory.icon} className="text-white" />
          </div>
          <div className="flex flex-col flex-shrink-0 w-8 h-10 items-center justify-center text-gray-700 text-xs">
            <p>{getTimeFromString(spot.start_time)}</p>
            <p>|</p>
            <p>{getTimeFromString(spot.end_time)}</p>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-700">{spot.name}</p>
            {spot.memo && (
              <>
                <div className="flex items-center text-gray-500 text-xs">
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <p>{spot.memo}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {deleteSpotModalOpen && (
        <Modal
          open={deleteSpotModalOpen}
          onClose={onCloseDeleteSpotModal}
          title={FORM_DELETE_SPOT}
        >
          <DeleteSpotForm onClose={onCloseDeleteSpotModal} />
        </Modal>
      )}
      {updateSpotModalOpen && (
        <Modal
          open={updateSpotModalOpen}
          onClose={onCloseUpdateSpotModal}
          title={FORM_UPDATE_SPOT}
        >
          <SpotForm
            onClose={onCloseUpdateSpotModal}
            mode={SPOT_FORM_MODE_UPDATE}
            date={spot.date}
          />
        </Modal>
      )}
    </>
  )
}
