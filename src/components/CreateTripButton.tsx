import React, { useState } from 'react'
import { CreateTripForm } from '@/components/CreateTripForm'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Modal } from '@/components/Modal'
import { FORM_CREATE_TRIP } from '@/utils/constants'

export const CreateTripButton: React.FC = () => {
  const [createTripModalOpen, setCreateTripModalOpen] = useState(false)

  const onOpenCreateTripModal = () => {
    setCreateTripModalOpen(true)
  }

  const onCloseCreateTripModal = () => {
    setCreateTripModalOpen(false)
  }

  return (
    <div className="space-x-4">
      <PrimaryButton
        onClick={onOpenCreateTripModal}
        label={FORM_CREATE_TRIP}
        className="bg-brand-color text-white hover:bg-opacity-80"
      />
      {createTripModalOpen && (
        <Modal
          open={createTripModalOpen}
          onClose={onCloseCreateTripModal}
          title={FORM_CREATE_TRIP}
        >
          <CreateTripForm onClose={onCloseCreateTripModal} />
        </Modal>
      )}
    </div>
  )
}
