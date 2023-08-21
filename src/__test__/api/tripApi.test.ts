import {
  createTripAPI,
  deleteTripAPI,
  getTripAPI,
  getTripsAPI,
  updateTripAPI,
} from '@/api/tripApi'
import { USERS_URL, TRIPS_URL } from '@/utils/constants'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('tripAPI', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockedAxios.get.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.post.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.patch.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.delete.mockResolvedValue({ data: 'data_mock' })
  })

  describe('getTripsAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await getTripsAPI('idToken_mock', 'user_uid_mock')

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}`,
          {
            headers: {
              Authorization: `Bearer idToken_mock`,
            },
          }
        )
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.get.mockRejectedValue(new Error('An error occurred'))

        await expect(
          getTripsAPI('idToken_mock', 'user_uid_mock')
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('getTripAPI', () => {
    describe('正常系', () => {
      it('user_uidが与えられた場合、正しいURLでリクエストされていること', async () => {
        await getTripAPI('trip_token_mock', 'user_uid_mock')

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock`
        )
      })

      it('user_uidが与えられなかった場合、正しいURLでリクエストされていること', async () => {
        await getTripAPI('trip_token_mock')

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${TRIPS_URL}/trip_token_mock`
        )
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.get.mockRejectedValue(new Error('An error occurred'))

        await expect(
          getTripAPI('trip_token_mock', 'user_uid_mock')
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('createTripAPI', () => {
    describe('正常系', () => {
      it('copy_trip_tokenが与えられなかった場合、正しいURLでリクエストされていること', async () => {
        await createTripAPI('idToken_mock', 'user_uid_mock', {
          user_id: 1,
          prefecture_id: 1,
          title: '北海道旅行',
          start_date: '2023-07-01',
          end_date: '2023-07-02',
        })

        expect(mockedAxios.post).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}`,
          {
            trip: {
              user_id: 1,
              prefecture_id: 1,
              title: '北海道旅行',
              start_date: '2023-07-01',
              end_date: '2023-07-02',
            },
          },
          {
            headers: {
              Authorization: `Bearer idToken_mock`,
            },
          }
        )
      })

      it('copy_trip_tokenが与えられた場合、正しいURLでリクエストされていること', async () => {
        await createTripAPI(
          'idToken_mock',
          'user_uid_mock',
          undefined,
          'copy_trip_token_mock'
        )

        expect(mockedAxios.post).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}?copy_trip_token=copy_trip_token_mock`,
          null,
          {
            headers: {
              Authorization: `Bearer idToken_mock`,
            },
          }
        )
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.post.mockRejectedValue(new Error('An error occurred'))

        await expect(
          createTripAPI('idToken_mock', 'user_uid_mock', {
            user_id: 1,
            prefecture_id: 1,
            title: '北海道旅行',
            start_date: '2023-07-01',
            end_date: '2023-07-02',
          })
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('updateTripAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await updateTripAPI(
          'idToken_mock',
          'user_uid_mock',
          'trip_token_mock',
          {
            prefecture_id: 1,
            title: '北海道旅行',
            start_date: '2023-07-01',
            end_date: '2023-07-02',
          }
        )

        expect(mockedAxios.patch).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock`,
          {
            trip: {
              prefecture_id: 1,
              title: '北海道旅行',
              start_date: '2023-07-01',
              end_date: '2023-07-02',
            },
          },
          {
            headers: {
              Authorization: `Bearer idToken_mock`,
            },
          }
        )
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.patch.mockRejectedValue(new Error('An error occurred'))

        await expect(
          updateTripAPI('idToken_mock', 'user_uid_mock', 'trip_token_mock', {
            prefecture_id: 1,
            title: '北海道旅行',
            start_date: '2023-07-01',
            end_date: '2023-07-02',
          })
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('deleteTripAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await deleteTripAPI('idToken_mock', 'user_uid_mock', 'trip_token_mock')

        expect(mockedAxios.delete).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock`,
          {
            headers: {
              Authorization: `Bearer idToken_mock`,
            },
          }
        )
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.delete.mockRejectedValue(new Error('An error occurred'))

        await expect(
          deleteTripAPI('idToken_mock', 'user_uid_mock', 'trip_token_mock')
        ).rejects.toThrow('An error occurred')
      })
    })
  })
})
