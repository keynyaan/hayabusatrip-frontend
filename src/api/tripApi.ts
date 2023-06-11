import axios from 'axios'
import { USERS_URL, TRIPS_URL } from '@/utils/constants'

export type DbTripData = {
  id: number
  user_id: number
  prefecture_id: number
  title: string
  start_date: string
  end_date: string
  memo: string
  image_path: string
  is_public: boolean
  trip_token: string
  created_at: string
  updated_at: string
}

export type CreateTripOptions = {
  user_id: number
  prefecture_id: number
  title: string
  start_date: string
  end_date: string
}

export type CopyTripOptions = {
  user_id: number
  prefecture_id: number
  title: string
  start_date: string
  end_date: string
  memo: string
  image_path: string
  is_public: boolean
}

export type UpdateTripOptions = {
  prefecture_id?: number
  title?: string
  start_date?: string
  end_date?: string
  memo?: string
  image_path?: string
  is_public?: boolean
}

// ユーザーの全ての旅行プランの取得
export const getTripsAPI = async (idToken: string, user_uid: string) => {
  try {
    const res = await axios.get(`${USERS_URL}/${user_uid}${TRIPS_URL}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

// 特定の旅行プランの取得
export const getTripAPI = async (trip_token: string, user_uid?: string) => {
  try {
    const url = user_uid
      ? `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}`
      : `${TRIPS_URL}/${trip_token}`

    const res = await axios.get(url)
    return res.data
  } catch (e) {
    throw e
  }
}

// 旅行プランの作成・コピー
export const createTripAPI = async (
  idToken: string,
  user_uid: string,
  options: CreateTripOptions | CopyTripOptions
) => {
  try {
    const params: { trip: CreateTripOptions | CopyTripOptions } = {
      trip: options,
    }

    const res = await axios.post(
      `${USERS_URL}/${user_uid}${TRIPS_URL}`,
      params,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )
    return res.data
  } catch (e) {
    throw e
  }
}

// 旅行プランの更新
export const updateTripAPI = async (
  idToken: string,
  user_uid: string,
  trip_token: string,
  options: UpdateTripOptions
) => {
  try {
    const params: { trip: UpdateTripOptions } = {
      trip: options,
    }

    const res = await axios.patch(
      `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}`,
      params,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )
    return res.data
  } catch (e) {
    throw e
  }
}

// 旅行プランの削除
export const deleteTripAPI = async (
  idToken: string,
  user_uid: string,
  trip_token: string
) => {
  try {
    const res = await axios.delete(
      `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )
    return res.status
  } catch (e) {
    throw e
  }
}
