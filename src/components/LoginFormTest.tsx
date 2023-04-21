import { useForm, SubmitHandler } from 'react-hook-form'

import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

// ログインフォームの入力項目
interface LoginFormInputs {
  email: string
  password: string
}

export const LoginForm = () => {
  // ログイン関数
  const { loginWithEmailAndPassword } = useFirebaseAuth()
  const loginFunc = (email: string, password: string) => {
    loginWithEmailAndPassword(email, password)
  }

  // ログインフォームの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()

  // ログインボタンの設定
  const login: SubmitHandler<LoginFormInputs> = (formData) => {
    loginFunc(formData.email, formData.password)
  }

  return (
    <form
      onSubmit={handleSubmit(login)}
      className="grid grid-cols-1 gap-6 m-16 w-[330px]"
    >
      <label>
        <input
          {...register('email', { required: true, maxLength: 319 })}
          type="email"
          className="mt-1 block w-full border-gray border-solid border"
          placeholder="メールアドレス"
        />
        <span className="text-red-600">
          {errors.email && 'メールアドレスは319文字以内で入力してください'}
        </span>
      </label>
      <label>
        <input
          {...register('password', { required: true, maxLength: 319 })}
          type="password"
          className="mt-1 block w-full border-gray border-solid border"
          placeholder="パスワード"
        />
        <span className="text-red-600">
          {errors.password && 'パスワードは319文字以内で入力してください'}
        </span>
      </label>
      <button
        type="submit"
        className="bg-slate-200 border-solid border border-slate-300
          rounded-md cursor-pointer hover:bg-slate-300"
      >
        ログイン
      </button>
    </form>
  )
}
