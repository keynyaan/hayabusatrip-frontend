import React, { FC } from 'react'
import ReactPaginate from 'react-paginate'

type PaginationProps = {
  pageNumber: number
  setPageNumber: (newPageNumber: number) => void
  itemsPerPage: number
  dataLength: number
}

export const Pagination: FC<PaginationProps> = ({
  pageNumber,
  setPageNumber,
  itemsPerPage,
  dataLength,
}) => {
  const pageCount = Math.ceil(dataLength / itemsPerPage)

  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected)
  }

  const commonClass =
    'w-10 h-10 flex items-center justify-center rounded-full transition'

  const defaultLinkClass = `${commonClass} hover:bg-brand-color-opacity-50 hover:text-white`

  return (
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      onPageChange={changePage}
      forcePage={pageNumber}
      containerClassName={'flex items-center justify-center gap-1'}
      pageLinkClassName={defaultLinkClass}
      previousLinkClassName={defaultLinkClass}
      nextLinkClassName={defaultLinkClass}
      activeClassName={`${commonClass} hover:bg-brand-color bg-brand-color text-white`}
      disabledClassName={`${commonClass} hover:bg-transparent hover:text-black opacity-10 cursor-default`}
    />
  )
}
