import {
  createSpotAPI,
  deleteSpotAPI,
  getSpotAPI,
  getSpotsAPI,
  updateSpotAPI,
} from '@/api/spotApi'
import {
  USERS_URL,
  TRIPS_URL,
  SPOTS_URL,
  UPDATE_SPOT_MIN_BASE_DATE,
} from '@/utils/constants'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('spotAPI', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockedAxios.get.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.post.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.put.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.delete.mockResolvedValue({ data: 'data_mock' })
  })

  describe('getSpotsAPI', () => {
    describe('正常系', () => {
      it('user_uidが与えられた場合、正しいURLでリクエストされていること', async () => {
        await getSpotsAPI('trip_token_mock', 'user_uid_mock')

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock${SPOTS_URL}`
        )
      })

      it('user_uidが与えられなかった場合、正しいURLでリクエストされていること', async () => {
        await getSpotsAPI('trip_token_mock')

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${TRIPS_URL}/trip_token_mock${SPOTS_URL}`
        )
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.get.mockRejectedValue(new Error('An error occurred'))

        await expect(getSpotsAPI('trip_token', 'user_uid')).rejects.toThrow(
          'An error occurred'
        )
      })
    })
  })

  describe('getSpotAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await getSpotAPI('user_uid_mock', 'trip_token_mock', 1)

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock${SPOTS_URL}/1`
        )
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.get.mockRejectedValue(new Error('An error occurred'))

        await expect(
          getSpotAPI('user_uid_mock', 'trip_token_mock', 1)
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('createSpotAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await createSpotAPI(
          'idToken_mock',
          'user_uid_mock',
          'trip_token_mock',
          {
            trip_id: 1,
            category: 'sightseeing',
            name: '観光',
            date: '2023-07-01',
            start_time: '13:00',
            end_time: '17:00',
            cost: 2000,
            memo: '',
          }
        )

        expect(mockedAxios.post).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock${SPOTS_URL}`,
          {
            spot: {
              trip_id: 1,
              category: 'sightseeing',
              name: '観光',
              date: '2023-07-01',
              start_time: '13:00',
              end_time: '17:00',
              cost: 2000,
              memo: '',
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
        mockedAxios.post.mockRejectedValue(new Error('An error occurred'))

        await expect(
          createSpotAPI('idToken_mock', 'user_uid_mock', 'trip_token_mock', {
            trip_id: 1,
            category: 'sightseeing',
            name: '観光',
            date: '2023-07-01',
            start_time: '13:00',
            end_time: '17:00',
            cost: 2000,
            memo: '',
          })
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('updateSpotAPI', () => {
    describe('正常系', () => {
      it('spot_idとoptionsが与えられた場合、正しいURLでリクエストされていること', async () => {
        await updateSpotAPI(
          'idToken_mock',
          'user_uid_mock',
          'trip_token_mock',
          1,
          {
            category: 'sightseeing',
            name: '観光',
            date: '2023-07-01',
            start_time: '13:00',
            end_time: '17:00',
            cost: 2000,
            memo: '',
          }
        )

        expect(mockedAxios.put).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock${SPOTS_URL}/1`,
          {
            spot: {
              category: 'sightseeing',
              name: '観光',
              date: '2023-07-01',
              start_time: '13:00',
              end_time: '17:00',
              cost: 2000,
              memo: '',
            },
          },
          {
            headers: {
              Authorization: `Bearer idToken_mock`,
            },
          }
        )
      })

      it('base_dateとdate_offsetが与えられた場合、正しいURLでリクエストされていること', async () => {
        await updateSpotAPI(
          'idToken_mock',
          'user_uid_mock',
          'trip_token_mock',
          undefined,
          undefined,
          UPDATE_SPOT_MIN_BASE_DATE,
          '2'
        )

        expect(mockedAxios.put).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock${SPOTS_URL}?base_date=${UPDATE_SPOT_MIN_BASE_DATE}&date_offset=2`,
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
      it('optionsとspot_idのセット、もしくはbase_dateとdate_offsetのセット以外の引数指定はエラーになること', async () => {
        await expect(
          updateSpotAPI('idToken_mock', 'user_uid_mock', 'trip_token_mock', 1)
        ).rejects.toThrow(
          'Either options&&spot_id or base_date&&date_offset must be provided.'
        )
      })

      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.put.mockRejectedValue(new Error('An error occurred'))

        await expect(
          updateSpotAPI('idToken_mock', 'user_uid_mock', 'trip_token_mock', 1, {
            category: 'sightseeing',
            name: '観光',
            date: '2023-07-01',
            start_time: '13:00',
            end_time: '17:00',
            cost: 2000,
            memo: '',
          })
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('deleteSpotAPI', () => {
    describe('正常系', () => {
      it('dateが与えられた場合、正しいURLでリクエストされていること', async () => {
        await deleteSpotAPI(
          'idToken_mock',
          'user_uid_mock',
          'trip_token_mock',
          undefined,
          '2023-07-01'
        )

        expect(mockedAxios.delete).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock${SPOTS_URL}?date=2023-07-01`,
          {
            headers: {
              Authorization: `Bearer idToken_mock`,
            },
          }
        )
      })

      it('spot_idが与えられた場合、正しいURLでリクエストされていること', async () => {
        await deleteSpotAPI(
          'idToken_mock',
          'user_uid_mock',
          'trip_token_mock',
          1
        )

        expect(mockedAxios.delete).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock${TRIPS_URL}/trip_token_mock${SPOTS_URL}/1`,
          {
            headers: {
              Authorization: `Bearer idToken_mock`,
            },
          }
        )
      })
    })

    describe('異常系', () => {
      it('spot_idとdateの両方とも引数に存在しない場合、エラーになること', async () => {
        await expect(
          deleteSpotAPI('idToken_mock', 'user_uid_mock', 'trip_token_mock')
        ).rejects.toThrow('Either spot_id or date must be provided.')
      })

      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.delete.mockRejectedValue(new Error('An error occurred'))

        await expect(
          deleteSpotAPI('idToken_mock', 'user_uid_mock', 'trip_token_mock', 1)
        ).rejects.toThrow('An error occurred')
      })
    })
  })
})
