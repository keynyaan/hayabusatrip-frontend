import React, { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import 'react-responsive-modal/styles.css'
import { Meta } from '@/components/Meta'
import { useAuthContext } from '@/context/AuthContext'
import { TripCard } from '@/components/TripCard'
import { Pagination } from '@/components/Pagination'

export default function Home() {
  const { currentUser, dbTripsData, authLoading } = useAuthContext()
  const spinner = <ClipLoader />

  const [pageNumber, setPageNumber] = useState(0)
  const itemsPerPage = 12
  const pagesVisited = pageNumber * itemsPerPage

  useEffect(() => {
    setPageNumber(0)
  }, [dbTripsData])

  return (
    <>
      <Meta />
      {authLoading && spinner}

      {!authLoading && !currentUser && <h2>未ログイン</h2>}
      {!authLoading && currentUser && (
        <>
          {dbTripsData && (
            <div className="m-4">
              <div className="grid grid-cols-auto-fill gap-4">
                {dbTripsData
                  .slice()
                  .reverse()
                  .slice(pagesVisited, pagesVisited + itemsPerPage)
                  .map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
              </div>

              <Pagination
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                itemsPerPage={itemsPerPage}
                dataLength={dbTripsData?.length || 0}
              />
            </div>
          )}
        </>
      )}
    </>
  )
}
