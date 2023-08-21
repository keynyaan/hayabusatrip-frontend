import {
  createUserAPI,
  deleteUserAPI,
  getUserAPI,
  getUsersAPI,
  updateUserAPI,
} from '@/api/userApi'
import { USERS_URL } from '@/utils/constants'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('userAPI', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockedAxios.get.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.post.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.patch.mockResolvedValue({ data: 'data_mock' })
    mockedAxios.delete.mockResolvedValue({ data: 'data_mock' })
  })

  describe('getUsersAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await getUsersAPI('idToken_mock')

        expect(mockedAxios.get).toHaveBeenCalledWith(`${USERS_URL}`, {
          headers: {
            Authorization: `Bearer idToken_mock`,
          },
        })
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.get.mockRejectedValue(new Error('An error occurred'))

        await expect(getUsersAPI('idToken_mock')).rejects.toThrow(
          'An error occurred'
        )
      })
    })
  })

  describe('getUserAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await getUserAPI('idToken_mock', 'user_uid_mock')

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock`,
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
          getUserAPI('idToken_mock', 'user_uid_mock')
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('createUserAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await createUserAPI('idToken_mock', {
          uid: 'uid_mock',
          name: 'name_mock',
          icon_path: 'icon_path_mock',
        })

        expect(mockedAxios.post).toHaveBeenCalledWith(
          `${USERS_URL}`,
          {
            user: {
              uid: 'uid_mock',
              name: 'name_mock',
              icon_path: 'icon_path_mock',
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
          createUserAPI('idToken_mock', {
            uid: 'uid_mock',
            name: 'name_mock',
            icon_path: 'icon_path_mock',
          })
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('updateUserAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await updateUserAPI('idToken_mock', {
          uid: 'uid_mock',
          name: 'name_mock',
          icon_path: 'icon_path_mock',
          last_login_time: 'last_login_time_mock',
        })

        expect(mockedAxios.patch).toHaveBeenCalledWith(
          `${USERS_URL}/uid_mock`,
          {
            user: {
              uid: 'uid_mock',
              name: 'name_mock',
              icon_path: 'icon_path_mock',
              last_login_time: 'last_login_time_mock',
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
          updateUserAPI('idToken_mock', {
            uid: 'uid_mock',
            name: 'name_mock',
            icon_path: 'icon_path_mock',
            last_login_time: 'last_login_time_mock',
          })
        ).rejects.toThrow('An error occurred')
      })
    })
  })

  describe('deleteUserAPI', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        await deleteUserAPI('idToken_mock', 'user_uid_mock')

        expect(mockedAxios.delete).toHaveBeenCalledWith(
          `${USERS_URL}/user_uid_mock`,
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
          deleteUserAPI('idToken_mock', 'user_uid_mock')
        ).rejects.toThrow('An error occurred')
      })
    })
  })
})
