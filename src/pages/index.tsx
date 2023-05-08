import React from 'react'
import { ClipLoader } from 'react-spinners'
import 'react-responsive-modal/styles.css'
import { Meta } from '@/components/Meta'
import { useAuthContext } from '@/context/AuthContext'
export default function Home() {
  const { currentUser, authLoading, redirectResultFetched, logout } =
    useAuthContext()
  const spinner = <ClipLoader />

  return (
    <>
      <Meta />
      <p>hayabusatrip</p>
      {redirectResultFetched
        ? 'redirectResultFetchedはtrue'
        : 'redirectResultFetchedはfalse'}
      {authLoading && spinner}

      {!authLoading && !currentUser && <h2>未ログイン</h2>}
      {!authLoading && currentUser && (
        <>
          <h2>ログイン済み</h2>
          <button onClick={logout}>Log out</button>
        </>
      )}
    </>
  )
}
