import axios from 'axios'
import { uploadImageToS3 } from '@/api/S3Api'
import { S3_UPLOAD_URL } from '@/utils/constants'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('userAPI', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockedAxios.post.mockResolvedValue({ data: { location: 'data_mock' } })
  })

  describe('uploadImageToS3', () => {
    describe('正常系', () => {
      it('正しいURLでリクエストされていること', async () => {
        const file = new File(['file content'], 'filename_mock', {
          type: 'image/png',
        })
        const formData = new FormData()
        formData.append('file', file)
        formData.append('filename', 'filename_mock')

        await uploadImageToS3('idToken_mock', file, 'filename_mock')

        expect(mockedAxios.post).toHaveBeenCalledWith(S3_UPLOAD_URL, formData, {
          headers: {
            Authorization: `Bearer idToken_mock`,
            'Content-Type': 'multipart/form-data',
          },
        })
      })
    })

    describe('異常系', () => {
      it('エラー時のハンドリングが正しいこと', async () => {
        mockedAxios.post.mockRejectedValue(new Error('An error occurred'))

        await expect(
          uploadImageToS3(
            'idToken_mock',
            new File(['content'], 'file_mock'),
            'filename_mock'
          )
        ).rejects.toThrow('An error occurred')
      })
    })
  })
})
