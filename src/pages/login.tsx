import type { NextPage } from 'next'

import { LoginForm } from '@/components/LoginForm'
import { useAuthContext } from '@/context/AuthContext'

const Login: NextPage = () => {
  const { currentUser, loading, logout, loginWithGoogle } = useAuthContext()

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>ログイン＆ログアウト機能のテスト用ページ</h1>
      <br />
      <br />
      {!loading && !currentUser && <h2>未ログイン</h2>}
      {!loading && currentUser && <h2>ログイン済み</h2>}

      <LoginForm />
      {!loading && !currentUser && (
        <button
          onClick={loginWithGoogle}
          className="w-[330px] mt-4 bg-slate-200 border-solid border border-slate-300
          rounded-md cursor-pointer hover:bg-slate-300"
        >
          Log in with Google
        </button>
      )}
      {!loading && currentUser && (
        <button
          onClick={logout}
          className="w-[330px] bg-slate-200 border-solid border border-slate-300
          rounded-md cursor-pointer hover:bg-slate-300"
        >
          Log out
        </button>
      )}
    </div>
  )
}

export default Login
