import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from '@/components/Modal'
import { CopyTripForm } from '@/components/CopyTripForm'
import { DeleteTripForm } from '@/components/DeleteTripForm'
import { TripPublishSettingsForm } from '@/components/TripPublishSettingsForm'
import {
  FORM_DELETE_TRIP,
  FORM_COPY_TRIP,
  FORM_TRIP_PUBLISH_SETTINGS,
} from '@/utils/constants'

type TripCardModalProps = {
  open: boolean
  onClose: () => void
  form: string
}

export const TripCardModal: FC<TripCardModalProps> = ({
  open,
  onClose,
  form,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={form}>
      {form === FORM_TRIP_PUBLISH_SETTINGS && (
        <TripPublishSettingsForm onClose={onClose} />
      )}
      {form === FORM_COPY_TRIP && <CopyTripForm onClose={onClose} />}
      {form === FORM_DELETE_TRIP && <DeleteTripForm onClose={onClose} />}
    </Modal>
  )
}
