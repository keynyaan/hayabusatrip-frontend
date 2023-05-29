import React from 'react'
import { ClipLoader } from 'react-spinners'
import 'react-responsive-modal/styles.css'
import { Meta } from '@/components/Meta'
import { useAuthContext } from '@/context/AuthContext'
import { TripCard } from '@/components/TripCard'

export default function Home() {
  const { currentUser, dbTripsData, authLoading } = useAuthContext()
  const spinner = <ClipLoader />

  return (
    <>
      <Meta />
      {authLoading && spinner}

      {!authLoading && !currentUser && <h2>未ログイン</h2>}
      {!authLoading && currentUser && (
        <>
          <div className="grid grid-cols-auto-fit gap-4 m-4">
            {dbTripsData?.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </>
      )}
    </>
  )
}
