import React, { FC, useState } from 'react'
import { CreateTripForm } from '@/components/CreateTripForm'
import { Modal } from '@/components/Modal'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'
import { FORM_CREATE_TRIP, FORM_CREATE_TRIP_SECONDARY } from '@/utils/constants'

type CreateTripButtondProps = {
  isSecondaryButton?: boolean
}

export const CreateTripButton: FC<CreateTripButtondProps> = ({
  isSecondaryButton,
}) => {
  const [createTripModalOpen, setCreateTripModalOpen] = useState(false)

  const onOpenCreateTripModal = () => {
    setCreateTripModalOpen(true)
  }

  const onCloseCreateTripModal = () => {
    setCreateTripModalOpen(false)
  }

  return (
    <>
      {isSecondaryButton ? (
        <SecondaryButton
          onClick={onOpenCreateTripModal}
          text={FORM_CREATE_TRIP_SECONDARY}
        />
      ) : (
        <PrimaryButton
          onClick={onOpenCreateTripModal}
          label={FORM_CREATE_TRIP}
          className="bg-brand-color text-white hover:bg-opacity-80"
        />
      )}

      {createTripModalOpen && (
        <Modal
          open={createTripModalOpen}
          onClose={onCloseCreateTripModal}
          title={FORM_CREATE_TRIP}
        >
          <CreateTripForm onClose={onCloseCreateTripModal} />
        </Modal>
      )}
    </>
  )
}
