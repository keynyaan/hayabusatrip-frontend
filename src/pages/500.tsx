import { Meta } from '@/components/Meta'
import { ServerError } from '@/components/ServerError'
import {
  SERVER_ERROR_PAGE_TITLE,
  SERVER_ERROR_PAGE_DESC,
} from '@/utils/constants'

export default function Custom500() {
  return (
    <>
      <Meta
        pageTitle={SERVER_ERROR_PAGE_TITLE}
        pageDesc={SERVER_ERROR_PAGE_DESC}
      />
      <ServerError />
    </>
  )
}
