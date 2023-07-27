import axios from 'axios'
import { USERS_URL } from '@/utils/constants'

export type DbUserData = {
  id: number
  uid: string
  created_at: string
  updated_at: string
  name: string
  icon_path: string
  last_login_time: string | null
}

export type CreateUserOptions = {
  uid: string
  name: string
  icon_path?: string
}

export type UpdateUserOptions = {
  uid: string
  name?: string
  icon_path?: string
  last_login_time?: string
}

// 全てのユーザー情報の取得
export const getUsersAPI = async (idToken: string) => {
  try {
    const res = await axios.get(USERS_URL, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

// 特定のユーザー情報の取得
export const getUserAPI = async (idToken: string, uid: string) => {
  try {
    const res = await axios.get(`${USERS_URL}/${uid}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

// 特定のユーザー情報の取得
export const createUserAPI = async (
  idToken: string,
  options: CreateUserOptions
) => {
  try {
    const params: { user: CreateUserOptions } = {
      user: options,
    }

    const res = await axios.post(USERS_URL, params, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

// ユーザー情報の更新
export const updateUserAPI = async (
  idToken: string,
  options: UpdateUserOptions
) => {
  try {
    const params: { user: UpdateUserOptions } = {
      user: options,
    }

    const res = await axios.patch(`${USERS_URL}/${options.uid}`, params, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

// ユーザーの削除
export const deleteUserAPI = async (idToken: string, uid: string) => {
  try {
    const res = await axios.delete(`${USERS_URL}/${uid}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}
