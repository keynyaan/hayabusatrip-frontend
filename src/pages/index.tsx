import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import 'react-responsive-modal/styles.css'
import { Meta } from '@/components/Meta'
import { CreateTripButton } from '@/components/CreateTripButton'
import { LP } from '@/components/LP'
import { Pagination } from '@/components/Pagination'
import { Spinner } from '@/components/Spinner'
import { TripCard } from '@/components/TripCard'
import { TripFilter } from '@/components/TripFilter'
import { useAuthContext } from '@/context/AuthContext'
import { TRIP_INDEX_PAGE_TITLE, TRIP_INDEX_PAGE_DESC } from '@/utils/constants'

export default function Home() {
  const {
    currentUser,
    dbTripsData,
    authLoading,
    filteredData,
    setFilteredData,
  } = useAuthContext()

  const [pageNumber, setPageNumber] = useState(0)
  const itemsPerPage = 12
  const pagesVisited = pageNumber * itemsPerPage

  useEffect(() => {
    if (dbTripsData) {
      setPageNumber(0)
      setFilteredData(dbTripsData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbTripsData])

  if (!currentUser) {
    return currentUser === null ? (
      <>
        <Meta />
        <LP />
      </>
    ) : null
  }

  if (authLoading || !dbTripsData || !filteredData) {
    return <Spinner />
  }

  if (dbTripsData.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <Image
          src={`${process.env.NEXT_PUBLIC_S3_OBJECT_URL}/utils/no_plan_sleeping_dog.png`}
          alt={'旅行プランがない時の眠る犬のイラスト'}
          width={250}
          height={250}
          priority
        />
        <p className="text-sm sm:text-base text-gray-700">
          旅行プランはありません。
          <br />
          次の旅行に向けて準備しませんか？
        </p>
        <CreateTripButton isSecondaryButton={true} />
      </div>
    )
  }

  return (
    <>
      <Meta pageTitle={TRIP_INDEX_PAGE_TITLE} pageDesc={TRIP_INDEX_PAGE_DESC} />
      <>
        <div className="p-4 space-y-4 max-w-6xl mx-auto">
          <TripFilter dbTripsData={dbTripsData} />

          {filteredData.length === 0 && (
            <div className="flex flex-col items-center">
              <p className="text-sm sm:text-base text-gray-700">
                検索条件に一致する旅行プランが見つかりませんでした。
                <br />
                検索条件を変更してください。
              </p>
              <Image
                src={`${process.env.NEXT_PUBLIC_S3_OBJECT_URL}/utils/plan_not_found_playing_cat.png`}
                alt={'旅行プランが見つからない時のボールで遊ぶ猫のイラスト'}
                width={250}
                height={250}
              />
            </div>
          )}

          {filteredData.length !== 0 && (
            <>
              <div className="grid grid-cols-auto-fill gap-4">
                {filteredData
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
                dataLength={filteredData.length || 0}
              />
            </>
          )}
        </div>
      </>
    </>
  )
}
