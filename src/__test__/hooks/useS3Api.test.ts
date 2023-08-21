import axios from 'axios'
import { renderHook, act } from '@testing-library/react'
import { useS3Api } from '@/hooks/useS3Api'
import {
  configureAuthContextMock,
  currentUserMock,
  dbUserDataMock,
  selectedTripMock,
  setS3ApiLoadingMock,
  updateTripAPIMock,
  uploadImageToS3Mock,
} from '@/__test__/utils/mocks'
import {
  FILE_SIZE_LIMIT_BYTES,
  TRIP_IMAGES_DIRECTORY,
  USERS_URL,
  USER_ICONS_DIRECTORY,
} from '@/utils/constants'
import { getTimestamp } from '@/utils/getTimestamp'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('@/context/ToastContext', () => ({
  useToast: jest.fn(),
}))
jest.mock('@/context/AuthContext')
jest.mock('@/context/ToastContext')
jest.mock('@/api/S3Api')
jest.mock('@/api/tripApi')
jest.mock('@/utils/getTimestamp', () => ({
  getTimestamp: () => 'timestamp_mock',
}))

describe('useS3Apiの確認', () => {
  beforeEach(() => {
    uploadImageToS3Mock.mockClear()
    mockedAxios.patch.mockResolvedValue({
      data: { icon_path: 'path/to/icon' },
    })
    uploadImageToS3Mock.mockResolvedValue('http://example.com/image.jpg')

    configureAuthContextMock()
  })

  describe('uploadTripImageの確認', () => {
    it('uploadImageToS3が正しく実行されること', async () => {
      const { result } = renderHook(() => useS3Api())

      const file = new File(['file_content'], 'image.jpg', {
        type: 'image/jpeg',
      })

      await act(async () => {
        await result.current.uploadTripImage(file)
      })

      expect(setS3ApiLoadingMock).toHaveBeenCalledWith(true)

      // 関数が期待通りに呼び出されたかの確認
      expect(uploadImageToS3Mock).toHaveBeenCalledWith(
        'idToken_mock',
        file,
        `${TRIP_IMAGES_DIRECTORY}/${currentUserMock.uid}/${
          selectedTripMock.trip_token
        }-${getTimestamp()}.${file.type.split('/')[1]}`
      )
      expect(setS3ApiLoadingMock).toHaveBeenCalledWith(false)
    })

    it('updateTripAPIが正しく実行されること', async () => {
      const { result } = renderHook(() => useS3Api())

      const file = new File(['file_content'], 'image.jpg', {
        type: 'image/jpeg',
      })

      await act(async () => {
        await result.current.uploadTripImage(file)
      })

      expect(setS3ApiLoadingMock).toHaveBeenCalledWith(true)

      // 関数が期待通りに呼び出されたかの確認
      expect(updateTripAPIMock).toHaveBeenCalledWith(
        'idToken_mock',
        currentUserMock.uid,
        selectedTripMock.trip_token,
        {
          image_path: 'http://example.com/image.jpg?v=timestamp_mock',
        }
      )

      expect(setS3ApiLoadingMock).toHaveBeenCalledWith(false)
    })
  })

  describe('uploadUserIconImageの確認', () => {
    it('uploadImageToS3が正しく実行されること', async () => {
      const { result } = renderHook(() => useS3Api())

      const file = new File(['file_content'], 'image.jpg', {
        type: 'image/jpeg',
      })

      await act(async () => {
        await result.current.uploadUserIconImage(file)
      })

      expect(setS3ApiLoadingMock).toHaveBeenCalledWith(true)

      // 関数が期待通りに呼び出されたかの確認
      expect(uploadImageToS3Mock).toHaveBeenCalledWith(
        'idToken_mock',
        file,
        `${USER_ICONS_DIRECTORY}/${currentUserMock.uid}-${getTimestamp()}.${
          file.type.split('/')[1]
        }`
      )

      expect(setS3ApiLoadingMock).toHaveBeenCalledWith(false)
    })

    it('ユーザー情報更新APIが正しく実行されること', async () => {
      const { result } = renderHook(() => useS3Api())

      const file = new File(['file_content'], 'image.jpg', {
        type: 'image/jpeg',
      })

      await act(async () => {
        await result.current.uploadUserIconImage(file)
      })

      expect(setS3ApiLoadingMock).toHaveBeenCalledWith(true)

      // 関数が期待通りに呼び出されたかの確認
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${USERS_URL}/${dbUserDataMock.uid}`,
        {
          user: {
            icon_path: 'http://example.com/image.jpg?v=timestamp_mock',
            uid: dbUserDataMock.uid,
          },
        },
        {
          headers: {
            Authorization: `Bearer idToken_mock`,
          },
        }
      )

      expect(setS3ApiLoadingMock).toHaveBeenCalledWith(false)
    })
  })

  describe('validateFileの確認', () => {
    it('ファイルタイプが画像でない場合、処理が終了すること', async () => {
      const { result } = renderHook(() => useS3Api())

      const invalidFile = new File(['file_content'], 'document.txt', {
        type: 'text/plain',
      })

      await act(async () => {
        await result.current.uploadUserIconImage(invalidFile)
      })

      // 関数が呼び出されないことの確認
      expect(uploadImageToS3Mock).not.toHaveBeenCalled()
    })

    it('ファイルサイズが制限を超える場合、処理が終了すること', async () => {
      const { result } = renderHook(() => useS3Api())

      const oversizedFile = new File(['file_content'], 'image.jpg', {
        type: 'image/jpeg',
      })
      Object.defineProperty(oversizedFile, 'size', {
        value: FILE_SIZE_LIMIT_BYTES + 1,
      })

      await act(async () => {
        await result.current.uploadUserIconImage(oversizedFile)
      })

      // 関数が呼び出されないことの確認
      expect(uploadImageToS3Mock).not.toHaveBeenCalled()
    })
  })
})
