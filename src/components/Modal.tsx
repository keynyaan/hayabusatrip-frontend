import { FC, useEffect } from 'react'
import { Modal as ResponsiveModal } from 'react-responsive-modal'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  initialCloseButtonBlur?: boolean
}

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  initialCloseButtonBlur = false,
}) => {
  useEffect(() => {
    if (initialCloseButtonBlur) {
      setTimeout(() => {
        const closeButton = document.querySelector(
          '.modal-close-button'
        ) as HTMLElement
        if (closeButton) {
          closeButton.blur()
        }
      }, 0)
    }
  }, [open, initialCloseButtonBlur])

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
