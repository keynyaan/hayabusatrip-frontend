import axios from 'axios'
import { usersUrl } from '@/utils/url'
import {
  CREATE_USER_ERROR_MSG,
  GET_USER_ERROR_MSG,
  UPDATE_USER_ERROR_MSG,
} from '@/utils/constants'

export type DbUserData = {
  id: number
  uid: string
  created_at: string
  updated_at: string
  name: string
  icon_path: string
  request_count: number
  last_reset_date: string | null
  last_login_time: string | null
}

type CreateUserOptions = {
  uid: string
  name: string
  icon_path?: string
}

type UpdateUserOptions = {
  uid: string
  name?: string
  icon_path?: string
  request_count?: number
  last_reset_date?: string
  last_login_time?: string
}

// 全てのユーザー情報の取得
export const getUsers = async (idToken: string) => {
  try {
    const res = await axios.get(usersUrl, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(GET_USER_ERROR_MSG)
  }
}

// 特定のユーザー情報の取得
export const getUser = async (idToken: string, uid: string) => {
  try {
    const res = await axios.get(`${usersUrl}/${uid}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(GET_USER_ERROR_MSG)
  }
}

// 特定のユーザー情報の取得
export const createUser = async (
  idToken: string,
  options: CreateUserOptions
) => {
  try {
    const params: { user: CreateUserOptions } = {
      user: options,
    }

    const res = await axios.post(usersUrl, params, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(CREATE_USER_ERROR_MSG)
  }
}

// ユーザー情報の更新
export const updateUser = async (
  idToken: string,
  options: UpdateUserOptions
) => {
  try {
    const params: { user: UpdateUserOptions } = {
      user: options,
    }

    const res = await axios.patch(`${usersUrl}/${options.uid}`, params, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(UPDATE_USER_ERROR_MSG)
  }
}
