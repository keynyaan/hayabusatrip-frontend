import React from 'react'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useAuthContext } from '@/context/AuthContext'
import { useS3Api } from '@/hooks/useS3Api'
import { useTripApi } from '@/hooks/useTripApi'
import Home from '@/pages/index'
import {
  UPDATE_TRIP_PUBLISH_SETTINGS_SUCCESS_MSG,
  UPDATE_TRIP_PUBLISH_SETTINGS_ERROR_MSG,
  UPDATE_TRIP_TITLE_SUCCESS_MSG,
  UPDATE_TRIP_TITLE_ERROR_MSG,
} from '@/utils/constants'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}))
jest.mock('@/context/AuthContext')
jest.mock('@/hooks/useTripApi')
jest.mock('@/hooks/useS3Api')

const useAuthContextMock = useAuthContext as jest.Mock
const useTripApiMock = useTripApi as jest.Mock
const useS3ApiMock = useS3Api as jest.Mock

const dbUserDataMock = {
  id: 'idMock',
}
const currentUserMock = {
  uid: 'uidMock',
  getIdToken: jest.fn().mockReturnValue('idTokenMock'),
}

const selectedTripMock = {
  id: 1,
  user_id: 1,
  prefecture_id: 1,
  title: '北海道旅行',
  start_date: '2023-07-01',
  end_date: '2023-07-02',
  memo: '',
  image_path: 'hokkaido.jpg',
  is_public: false,
  trip_token: 'tripTokenMock',
  created_at: '2023-07-01T09:00:00.000+09:00',
  updated_at: '2023-07-01T09:00:00.000+09:00',
}

const dbTripsDataMock = [selectedTripMock]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderHomeWithMock = (props: any = {}) => {
  useAuthContextMock.mockReturnValue({
    currentUser: props.currentUser || null,
    dbUserData: props.dbUserData || null,
    dbTripsData: props.dbTripsData || null,
    selectedTrip: props.selectedTrip || null,
    authLoading: props.authLoading || false,
    destinationFilter: props.destinationFilter || null,
    dateFilter: props.dateFilter || null,
    statusFilter: props.statusFilter || null,
    filteredData: props.filteredData || null,
    handleDestinationFilterChange: jest.fn(),
    handleDateFilterChange: jest.fn(),
    handleStatusFilterChange: jest.fn(),
    setFilteredData: jest.fn(),
    setSelectedTrip: jest.fn(),
    ...props,
  })
  return render(<Home />)
}

describe('非ログイン時', () => {
  it('LPが表示されること', () => {
    renderHomeWithMock()

    expect(screen.getByText('旅行プラン共有サービス')).toBeInTheDocument()
    expect(screen.getByText('旅行プラン共有の手順')).toBeInTheDocument()
    expect(screen.getByText('開発者のメッセージ')).toBeInTheDocument()
    expect(screen.getByText('#HayabusaTrip')).toBeInTheDocument()

    const twitterLink = screen.getByRole('link', { name: /Twitterでシェア/ })
    expect(twitterLink.getAttribute('href')).toBe(
      `https://twitter.com/intent/tweet?&hashtags=HayabusaTrip&text=HayabusaTripを使ってみたよ。簡単に旅行プランが作れて便利だから、みんなもぜひ試してみてね！&url=https://www.hayabusatrip.com`
    )
  })
})

describe('authLoading時', () => {
  it('Spinnerが表示されること', () => {
    renderHomeWithMock({
      currentUser: currentUserMock,
      authLoading: true,
    })

    expect(screen.getByTestId('tail-spin-loading')).toBeInTheDocument()
  })
})

describe('ログイン時', () => {
  describe('dbTripsDataが存在しない時', () => {
    it('「さっそく準備する！」ボタンから、旅行プランを作成できること', async () => {
      const createTripMock = jest.fn().mockResolvedValue(true)

      useTripApiMock.mockReturnValue({
        createTrip: createTripMock,
      })

      renderHomeWithMock({
        currentUser: currentUserMock,
        dbUserData: dbUserDataMock,
        dbTripsData: [],
        filteredData: [],
      })

      // 旅行プラン作成ボタンをクリック
      const createTripButton = screen.getByRole('button', {
        name: 'さっそく準備する！',
      })
      fireEvent.click(createTripButton)

      // 作成ボタンがdisabledであることの確認
      const createButton = screen.getByRole('button', {
        name: '作成',
      })
      expect(createButton).toBeDisabled()

      // 旅行タイトルの設定
      fireEvent.change(screen.getByLabelText('旅行タイトル'), {
        target: { value: '海外旅行' },
      })

      // 旅行先の設定
      fireEvent.change(screen.getByLabelText('旅行先'), {
        target: { value: '48' },
      })

      // 開始日の設定
      fireEvent.change(screen.getByLabelText('開始日'), {
        target: { value: '2023-08-01' },
      })

      // 終了日の設定
      fireEvent.change(screen.getByLabelText('終了日'), {
        target: { value: '2023-08-02' },
      })

      // 作成ボタンがdisabledでないことの確認
      expect(createButton).not.toBeDisabled()

      // 作成ボタンをクリック
      fireEvent.click(createButton)

      // 実行時のAPIパラメーターの確認
      await waitFor(() => {
        expect(createTripMock).toHaveBeenCalledWith(
          currentUserMock.getIdToken(),
          currentUserMock.uid,
          {
            user_id: dbUserDataMock.id,
            prefecture_id: parseInt('48'),
            title: '海外旅行',
            start_date: '2023-08-01',
            end_date: '2023-08-02',
          }
        )
      })
    })
  })

  describe('dbTripsDataが存在する時', () => {
    it('TripFilterが表示されること', () => {
      renderHomeWithMock({
        currentUser: currentUserMock,
        dbTripsData: dbTripsDataMock,
        destinationFilter: '1',
        dateFilter: { year: '2023', month: '7', day: '1' },
        statusFilter: 'true',
        filteredData: [],
      })

      expect(screen.getByLabelText('旅行先')).toBeInTheDocument()
      expect(
        screen.getByText('北海道', { selector: 'option' })
      ).toBeInTheDocument()
      expect(screen.getByLabelText('旅行年')).toBeInTheDocument()
      expect(
        screen.getByText('2023', { selector: 'option' })
      ).toBeInTheDocument()
      expect(screen.getByLabelText('旅行月')).toBeInTheDocument()
      expect(screen.getByText('7', { selector: 'option' })).toBeInTheDocument()
      expect(screen.getByLabelText('旅行日')).toBeInTheDocument()
      expect(screen.getByText('1', { selector: 'option' })).toBeInTheDocument()
      expect(screen.getByText('2', { selector: 'option' })).toBeInTheDocument()
      expect(screen.getByLabelText('公開状態')).toBeInTheDocument()
      expect(
        screen.getByText('公開', { selector: 'option' })
      ).toBeInTheDocument()
      expect(
        screen.getByText('非公開', { selector: 'option' })
      ).toBeInTheDocument()
      const options = screen.getAllByText('すべて', { selector: 'option' })
      expect(options.length).toBe(5)
    })

    describe('filteredDataが存在しない時', () => {
      it('存在しない旨のテキストが表示されること', () => {
        renderHomeWithMock({
          currentUser: currentUserMock,
          dbTripsData: dbTripsDataMock,
          destinationFilter: '1',
          dateFilter: { year: '2023', month: '7', day: '1' },
          statusFilter: 'true',
          filteredData: [],
        })

        expect(
          screen.getByText(
            /^検索条件に一致する旅行プランが見つかりませんでした/
          )
        ).toBeInTheDocument()
      })
    })

    describe('filteredDataが存在する時', () => {
      it('TripCardとPaginationが表示されること', () => {
        renderHomeWithMock({
          currentUser: currentUserMock,
          dbTripsData: dbTripsDataMock,
          destinationFilter: '1',
          dateFilter: { year: '2023', month: '7', day: '1' },
          statusFilter: 'true',
          filteredData: dbTripsDataMock,
        })

        // TripCard
        const image = screen.getByRole('img', { name: '北海道旅行の旅行画像' })
        expect(image).toHaveAttribute('src', 'hokkaido.jpg')

        const link = image.closest('a')
        expect(link).toHaveAttribute('href', '/trips/tripTokenMock')

        expect(screen.getByText('北海道旅行')).toBeInTheDocument()
        expect(screen.getByText('2023/07/01-2023/07/02')).toBeInTheDocument()
        expect(
          screen.getByText('北海道', { selector: 'span' })
        ).toBeInTheDocument()

        // Pagination
        expect(screen.getByText('<')).toBeInTheDocument()
        expect(screen.getByText('1', { selector: 'a' })).toBeInTheDocument()
        expect(screen.getByText('>')).toBeInTheDocument()
      })

      describe('TripCardの三点リーダークリック時', () => {
        const setupTest = () => {
          renderHomeWithMock({
            currentUser: currentUserMock,
            dbUserData: dbUserDataMock,
            dbTripsData: dbTripsDataMock,
            selectedTrip: selectedTripMock,
            destinationFilter: '1',
            dateFilter: { year: '2023', month: '7', day: '1' },
            statusFilter: 'true',
            filteredData: dbTripsDataMock,
          })

          // 三点リーダーをクリック
          act(() => {
            const ellipsisSvg = document.querySelector('.fa-ellipsis')
            if (ellipsisSvg) {
              fireEvent.click(ellipsisSvg)
            } else {
              throw new Error('Ellipsis SVG not found')
            }
          })
        }

        it('ドロップダウンメニューが表示されること', () => {
          setupTest()

          const buttonNames = [
            '写真の変更',
            '公開状態の変更',
            'タイトルの変更',
            'コピー',
            '削除',
          ]

          // 各ボタンが表示されること
          buttonNames.forEach((name) => {
            expect(screen.getByRole('button', { name })).toBeInTheDocument()
          })
        })

        describe('写真の変更ボタンクリック時', () => {
          it('写真の変更ができること', async () => {
            const uploadTripImageMock = jest.fn().mockResolvedValue(true)

            useS3ApiMock.mockReturnValue({
              uploadTripImage: uploadTripImageMock,
            })

            setupTest()

            // 写真の変更ボタンをクリック
            fireEvent.click(
              screen.getByRole('button', {
                name: '写真の変更',
              })
            )

            // フォームタイトルの確認
            expect(screen.getByText('旅行写真変更')).toBeInTheDocument()

            // input要素の取得
            const fileInput = document.querySelector('input[type="file"]')
            if (!fileInput) {
              throw new Error('fileInput not found')
            }

            // ファイルの選択
            const file = new File(['file-content'], 'file-name.png', {
              type: 'image/png',
            })
            fireEvent.change(fileInput, { target: { files: [file] } })

            // 実行時のAPIパラメーターの確認
            await waitFor(() => {
              expect(uploadTripImageMock).toHaveBeenCalledWith(file)
            })
          })
        })

        describe('公開状態の変更ボタンクリック時', () => {
          it('公開状態の変更ができること', async () => {
            const updateTripMock = jest.fn().mockResolvedValue(true)

            useTripApiMock.mockReturnValue({
              updateTrip: updateTripMock,
            })

            setupTest()

            // 公開状態の変更ボタンをクリック
            fireEvent.click(
              screen.getByRole('button', {
                name: '公開状態の変更',
              })
            )

            // フォームタイトルの確認
            expect(screen.getByText('公開状態変更')).toBeInTheDocument()

            // 公開に変更ボタンをクリック
            const button = screen.getByRole('button', {
              name: '公開に変更',
            })
            fireEvent.click(button)

            // 実行時のAPIパラメーターの確認
            await waitFor(() => {
              expect(updateTripMock).toHaveBeenCalledWith(
                currentUserMock.getIdToken(),
                currentUserMock.uid,
                selectedTripMock.trip_token,
                {
                  is_public: true,
                },
                UPDATE_TRIP_PUBLISH_SETTINGS_SUCCESS_MSG,
                UPDATE_TRIP_PUBLISH_SETTINGS_ERROR_MSG
              )
            })
          })
        })

        describe('タイトルの変更ボタンクリック時', () => {
          it('タイトルの変更ができること', async () => {
            const updateTripMock = jest.fn().mockResolvedValue(true)

            useTripApiMock.mockReturnValue({
              updateTrip: updateTripMock,
            })

            setupTest()

            // タイトルの変更ボタンをクリック
            fireEvent.click(
              screen.getByRole('button', {
                name: 'タイトルの変更',
              })
            )

            // フォームタイトルの確認
            expect(screen.getByText('旅行タイトル変更')).toBeInTheDocument()

            // 旅行タイトルの設定
            fireEvent.change(screen.getByLabelText('旅行タイトル'), {
              target: { value: '北海道旅行2' },
            })

            // 変更ボタンをクリック
            const button = screen.getByRole('button', {
              name: '変更',
            })
            fireEvent.click(button)

            // 実行時のAPIパラメーターの確認
            await waitFor(() => {
              expect(updateTripMock).toHaveBeenCalledWith(
                currentUserMock.getIdToken(),
                currentUserMock.uid,
                selectedTripMock.trip_token,
                {
                  title: '北海道旅行2',
                },
                UPDATE_TRIP_TITLE_SUCCESS_MSG,
                UPDATE_TRIP_TITLE_ERROR_MSG
              )
            })
          })
        })

        describe('コピーボタンクリック時', () => {
          it('コピーができること', async () => {
            const copyTripMock = jest.fn().mockResolvedValue(true)

            useTripApiMock.mockReturnValue({
              copyTrip: copyTripMock,
            })

            setupTest()

            // コピーボタンをクリック
            fireEvent.click(
              screen.getByRole('button', {
                name: 'コピー',
              })
            )

            // フォームタイトルの確認
            expect(screen.getByText('旅行プランコピー')).toBeInTheDocument()

            // コピーボタンをクリック
            const button = screen.getByRole('button', {
              name: 'コピー',
            })
            fireEvent.click(button)

            // 実行時のAPIパラメーターの確認
            await waitFor(() => {
              expect(copyTripMock).toHaveBeenCalledWith(
                currentUserMock.getIdToken(),
                currentUserMock.uid,
                selectedTripMock
              )
            })
          })
        })

        describe('削除ボタンクリック時', () => {
          it('削除ができること', async () => {
            const deleteTripMock = jest.fn().mockResolvedValue(true)

            useTripApiMock.mockReturnValue({
              deleteTrip: deleteTripMock,
            })

            setupTest()

            // 削除ボタンをクリック
            fireEvent.click(
              screen.getByRole('button', {
                name: '削除',
              })
            )

            // フォームタイトルの確認
            expect(screen.getByText('旅行プラン削除')).toBeInTheDocument()

            // 削除ボタンをクリック
            const button = screen.getByRole('button', {
              name: '削除',
            })
            fireEvent.click(button)

            // 実行時のAPIパラメーターの確認
            await waitFor(() => {
              expect(deleteTripMock).toHaveBeenCalledWith(
                currentUserMock.getIdToken(),
                currentUserMock.uid,
                selectedTripMock.trip_token
              )
            })
          })
        })
      })
    })
  })
})
