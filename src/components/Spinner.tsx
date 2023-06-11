import { FC } from 'react'

import { TailSpin } from 'react-loader-spinner'

type SpinnerProps = {
  isFormButton?: boolean
}

export const Spinner: FC<SpinnerProps> = ({ isFormButton }) => {
  return isFormButton ? (
    <TailSpin height="24" width="24" color="#ffffff" />
  ) : (
    <div className="flex justify-center mt-16">
      <TailSpin height="80" width="80" color="#00aab9" />
    </div>
  )
}
