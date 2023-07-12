import React, { FC } from 'react'
import 'react-responsive-modal/styles.css'
import { FormButton } from '@/components/FormButton'
import { InputField } from '@/components//InputField'
import { useAuthContext } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTripApi } from '@/hooks/useTripApi'
import {
  NOT_LOGIN_ERROR_MSG,
  SITE_META,
  TRIPS_URL,
  UPDATE_TRIP_PUBLISH_SETTINGS_ERROR_MSG,
  UPDATE_TRIP_PUBLISH_SETTINGS_SUCCESS_MSG,
} from '@/utils/constants'

type TripPublishSettingsFormProps = {
  onClose: () => void
}

export const TripPublishSettingsForm: FC<TripPublishSettingsFormProps> = ({
  onClose,
}) => {
  const { currentUser, dbUserData, selectedTrip, tripApiLoading } =
    useAuthContext()
  const { updateTrip } = useTripApi()
  const { showToast } = useToast()
  const { siteUrl } = SITE_META

  const updateTripFunc = async () => {
    if (currentUser && dbUserData && selectedTrip) {
      const idToken = await currentUser.getIdToken()
      const success = await updateTrip(
        idToken,
        currentUser.uid,
        selectedTrip.trip_token,
        {
          is_public: !selectedTrip.is_public,
        },
        UPDATE_TRIP_PUBLISH_SETTINGS_SUCCESS_MSG,
        UPDATE_TRIP_PUBLISH_SETTINGS_ERROR_MSG
      )

      if (success) {
        onClose()
      }
    } else {
      showToast('error', NOT_LOGIN_ERROR_MSG)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateTripFunc()
  }

  const isFormValid =
    Boolean(currentUser) && Boolean(dbUserData) && Boolean(selectedTrip)

  return (
    <>
      {selectedTrip && (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            {selectedTrip.is_public
              ? `「${selectedTrip.title}」を非公開にします。この旅行プランはあなただけが下記のURLでアクセスできます。`
              : `「${selectedTrip.title}」を下記のURLで公開します。旅行プランに個人情報やクレジットカード番号などは記載しないようにご注意ください。`}
          </p>
          <InputField
            id="public-url"
            type="text"
            labelName={selectedTrip.is_public ? '非公開URL' : '公開URL'}
            value={`${siteUrl}${TRIPS_URL}/${selectedTrip.trip_token}`}
            readonly={true}
            onCopy={true}
          />
          <form onSubmit={handleSubmit}>
            <FormButton
              label={selectedTrip.is_public ? '非公開に変更' : '公開に変更'}
              isFormValid={isFormValid}
              loading={tripApiLoading}
            />
          </form>
        </div>
      )}
    </>
  )
}
