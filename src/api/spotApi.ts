import axios from 'axios'
import { USERS_URL, TRIPS_URL, SPOTS_URL } from '@/utils/constants'

export type DbSpotData = {
  id: number
  trip_id: number
  category: string
  name: string
  date: string
  start_time: string
  end_time: string
  cost: number
  memo: string
  created_at: string
  updated_at: string
}

export type CreateSpotOptions = {
  trip_id: number
  category: string
  name: string
  date: string
  start_time: string
  end_time: string
  cost: number
  memo: string
}

export type UpdateSpotOptions = {
  category?: string
  name?: string
  date?: string
  start_time?: string
  end_time?: string
  cost?: number
  memo?: string
}

// 旅行プラン内の全ての旅行スポットの取得
export const getSpotsAPI = async (trip_token: string, user_uid?: string) => {
  try {
    const url = user_uid
      ? `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}${SPOTS_URL}`
      : `${TRIPS_URL}/${trip_token}${SPOTS_URL}`
    const res = await axios.get(url)
    return res.data
  } catch (e) {
    throw e
  }
}

// 特定の旅行スポットの取得
export const getSpotAPI = async (
  user_uid: string,
  trip_token: string,
  spot_id: number
) => {
  try {
    const res = await axios.get(
      `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}${SPOTS_URL}/${spot_id}`
    )
    return res.data
  } catch (e) {
    throw e
  }
}

// 旅行スポットの作成
export const createSpotAPI = async (
  idToken: string,
  user_uid: string,
  trip_token: string,
  options: CreateSpotOptions
) => {
  try {
    const params: { spot: CreateSpotOptions } = {
      spot: options,
    }

    const res = await axios.post(
      `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}${SPOTS_URL}`,
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

// 旅行スポットの更新
export const updateSpotAPI = async (
  idToken: string,
  user_uid: string,
  trip_token: string,
  spot_id?: number,
  options?: UpdateSpotOptions,
  base_date?: string,
  date_offset?: string
) => {
  if (!(options && spot_id) && !(base_date && date_offset)) {
    throw new Error(
      'Either options&&spot_id or base_date&&date_offset must be provided.'
    )
  }

  try {
    const url =
      options && spot_id
        ? `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}${SPOTS_URL}/${spot_id}`
        : `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}${SPOTS_URL}?base_date=${base_date}&date_offset=${date_offset}`

    const params = options ? { spot: options } : null

    const res = await axios.put(url, params, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.data
  } catch (e) {
    throw e
  }
}

// 旅行スポットの削除
export const deleteSpotAPI = async (
  idToken: string,
  user_uid: string,
  trip_token: string,
  spot_id?: number,
  date?: string
) => {
  if (!spot_id && !date) {
    throw new Error('Either spot_id or date must be provided.')
  }

  try {
    const url = date
      ? `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}${SPOTS_URL}?date=${date}`
      : `${USERS_URL}/${user_uid}${TRIPS_URL}/${trip_token}${SPOTS_URL}/${spot_id}`

    const res = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return res.status
  } catch (e) {
    throw e
  }
}
