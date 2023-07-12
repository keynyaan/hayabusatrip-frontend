import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from '@/components/Modal'
import { DeleteAccountForm } from '@/components/DeleteAccountForm'
import { PasswordResetForm } from '@/components/PasswordResetForm'
import { FORM_PASSWORD_RESET, FORM_DELETE_ACCOUNT } from '@/utils/constants'

type SettingsModalProps = {
  open: boolean
  onClose: () => void
  form: string
}

export const SettingsModal: FC<SettingsModalProps> = ({
  open,
  onClose,
  form,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={form}>
      {form === FORM_PASSWORD_RESET && (
        <PasswordResetForm onClose={onClose} login={true} />
      )}
      {form === FORM_DELETE_ACCOUNT && <DeleteAccountForm onClose={onClose} />}
    </Modal>
  )
}
