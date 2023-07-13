import { FC } from 'react'

import { Modal as ResponsiveModal } from 'react-responsive-modal'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal: FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <ResponsiveModal
      open={open}
      onClose={onClose}
      center
      classNames={{
        modal: 'rounded',
        closeButton: 'modal-close-button',
      }}
    >
      <div className="max-w-sm">
        <h2 className="text-lg sm:text-xl mb-5 text-gray-700">{title}</h2>
        {children}
      </div>
    </ResponsiveModal>
  )
}
