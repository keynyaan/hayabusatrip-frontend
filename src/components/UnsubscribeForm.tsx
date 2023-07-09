import React, { FC, useState } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { useAuthContext } from '@/context/AuthContext'

type PasswordResetFormProps = {
  onClose: () => void
}

export const UnsubscribeForm: FC<PasswordResetFormProps> = ({ onClose }) => {
  const { anyLoading, deleteUser } = useAuthContext()
  const [isChecked, setIsChecked] = useState(false)

  const deleteUserFunc = async () => {
    const success = await deleteUser()
    if (success) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deleteUserFunc()
  }

  return (
    <>
      <p className="text-gray-700 mb-4">
        アカウントを削除すると、これまでのデータは全て削除され、復元できなくなります。この操作は取り消せません。本当にアカウントを削除してもよろしいですか？
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center">
          <input
            id="confirmDeletion"
            type="checkbox"
            className="mr-2"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="confirmDeletion" className="text-gray-700">
            同意する
          </label>
        </div>
        <FormButton
          label="アカウントを削除"
          isFormValid={isChecked}
          loading={anyLoading}
          isRedStyle={true}
        />
      </form>
    </>
  )
}
