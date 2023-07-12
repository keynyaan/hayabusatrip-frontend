import { Meta } from '@/components/Meta'
import { NotFound } from '@/components/NotFound'
import { NOT_FOUND_PAGE_TITLE, NOT_FOUND_PAGE_DESC } from '@/utils/constants'

export default function Custom404() {
  return (
    <>
      <Meta pageTitle={NOT_FOUND_PAGE_TITLE} pageDesc={NOT_FOUND_PAGE_DESC} />
      <NotFound />
    </>
  )
}
