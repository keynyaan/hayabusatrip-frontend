import { renderHook, act, waitFor } from '@testing-library/react'
import { useSpotApi } from '@/hooks/useSpotApi'
import {
  createSpotAPIMock,
  configureAuthContextMock,
  getSpotsAPIMock,
  getSpotAPIMock,
  updateSpotAPIMock,
  deleteSpotAPIMock,
  setSpotApiLoadingMock,
} from '@/__test__/utils/mocks'

jest.mock('@/context/ToastContext')
jest.mock('@/context/AuthContext')
jest.mock('@/api/spotApi')
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}))

describe('useSpotApiの確認', () => {
  beforeEach(() => {
    configureAuthContextMock()
  })

  it('getSpotsが正しく実行されること', async () => {
    const { result } = renderHook(() => useSpotApi())

    // APIの実行
    await act(async () => {
      await result.current.getSpots('idToken_mock', 'uid_mock')
    })

    // 実行時のAPIパラメーターの確認
    await waitFor(() => {
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(true)
      expect(getSpotsAPIMock).toHaveBeenCalledWith('idToken_mock', 'uid_mock')
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(false)
    })
  })

  it('getSpotが正しく実行されること', async () => {
    const { result } = renderHook(() => useSpotApi())

    // APIの実行
    await act(async () => {
      await result.current.getSpot('idToken_mock', 'uid_mock', 1)
    })

    // 実行時のAPIパラメーターの確認
    await waitFor(() => {
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(true)
      expect(getSpotAPIMock).toHaveBeenCalledWith('idToken_mock', 'uid_mock', 1)
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(false)
    })
  })

  it('createSpotが正しく実行されること', async () => {
    const { result } = renderHook(() => useSpotApi())

    // APIの実行
    await act(async () => {
      await result.current.createSpot(
        'idToken_mock',
        'uid_mock',
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
    })

    // 実行時のAPIパラメーターの確認
    await waitFor(() => {
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(true)
      expect(createSpotAPIMock).toHaveBeenCalledWith(
        'idToken_mock',
        'uid_mock',
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
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(false)
    })
  })

  it('updateSpotが正しく実行されること', async () => {
    const { result } = renderHook(() => useSpotApi())

    // APIの実行
    await act(async () => {
      await result.current.updateSpot(
        'idToken_mock',
        'uid_mock',
        'spot_token_mock',
        1,
        {
          category: 'meal',
          name: '食費',
          date: '2023-07-01',
          start_time: '12:00',
          end_time: '13:00',
          cost: 3000,
          memo: '',
        }
      )
    })

    // 実行時のAPIパラメーターの確認
    await waitFor(() => {
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(true)
      expect(updateSpotAPIMock).toHaveBeenCalledWith(
        'idToken_mock',
        'uid_mock',
        'spot_token_mock',
        1,
        {
          category: 'meal',
          name: '食費',
          date: '2023-07-01',
          start_time: '12:00',
          end_time: '13:00',
          cost: 3000,
          memo: '',
        },
        undefined,
        undefined
      )
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(false)
    })
  })

  it('deleteSpotが正しく実行されること', async () => {
    const { result } = renderHook(() => useSpotApi())

    // APIの実行
    await act(async () => {
      await result.current.deleteSpot(
        'idToken_mock',
        'uid_mock',
        'spot_token_mock',
        1,
        '2023-07-01'
      )
    })

    // 実行時のAPIパラメーターの確認
    await waitFor(() => {
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(true)
      expect(deleteSpotAPIMock).toHaveBeenCalledWith(
        'idToken_mock',
        'uid_mock',
        'spot_token_mock',
        1,
        '2023-07-01'
      )
      expect(setSpotApiLoadingMock).toHaveBeenCalledWith(false)
    })
  })
})
