import { fireEvent, waitFor, screen, act, render } from '@testing-library/react'
import TripDetail from '@/pages/trips/[trip_token]'
import Home from '@/pages'
import {
  currentUserMock,
  dbUserDataMock,
  dbTripsDataMock,
  dbSpotsDataMock,
  selectedTripMock,
  configureApiMocks,
  copyTripMock,
  deleteTripMock,
  updateTripMock,
  uploadTripImageMock,
  useAuthContextMock,
  selectedSpotMock,
  createTripMock,
} from '@/__test__/utils/mocks'
import {
  UPDATE_TRIP_PUBLISH_SETTINGS_SUCCESS_MSG,
  UPDATE_TRIP_PUBLISH_SETTINGS_ERROR_MSG,
  UPDATE_TRIP_TITLE_SUCCESS_MSG,
  UPDATE_TRIP_TITLE_ERROR_MSG,
  UPDATE_TRIP_DESTINATION_ERROR_MSG,
  UPDATE_TRIP_DESTINATION_SUCCESS_MSG,
} from '@/utils/constants'

jest.mock('@/context/AuthContext')
jest.mock('@/hooks/useTripApi')
jest.mock('@/hooks/useSpotApi')
jest.mock('@/hooks/useS3Api')

const testConfig = {
  isHome: false,
  isTripDetail: false,
}

export const setIsHome = (isHome: boolean) => {
  testConfig.isHome = isHome
}
export const setIsTripDetail = (isTripDetail: boolean) => {
  testConfig.isTripDetail = isTripDetail
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderHomeWithMock = (props: any = {}) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderTripDetailWithMock = async (props: any = {}) => {
  useAuthContextMock.mockReturnValue({
    currentUser: props.currentUser || currentUserMock,
    dbUserData: props.dbUserData || dbUserDataMock,
    dbTripsData: props.dbTripsData || dbTripsDataMock,
    selectedTrip: props.selectedTrip || selectedTripMock,
    dbSpotsData: props.dbSpotsData || dbSpotsDataMock,
    selectedSpot: props.selectedSpot || selectedSpotMock,
    authStateChangedLoading: props.authStateChangedLoading || false,
    setSelectedTrip: jest.fn(),
    setDbSpotsData: jest.fn(),
    setSelectedSpot: jest.fn(),
    ...props,
  })

  await act(async () => {
    render(<TripDetail />)
  })
}

const clickFaEllipsis = async () => {
  const homeMock = {
    currentUser: currentUserMock,
    dbUserData: dbUserDataMock,
    dbTripsData: dbTripsDataMock,
    selectedTrip: selectedTripMock,
    destinationFilter: '1',
    dateFilter: { year: '2023', month: '7', day: '1' },
    statusFilter: 'true',
    filteredData: dbTripsDataMock,
  }
  configureApiMocks()

  if (testConfig.isHome) {
    renderHomeWithMock(homeMock)
  } else if (testConfig.isTripDetail) {
    await renderTripDetailWithMock()
  }

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

export const testDropdownMenu = (names: string[]) => {
  it('ドロップダウンメニューが表示されること', async () => {
    await clickFaEllipsis()

    // 各ボタンが表示されること
    names.forEach((name) => {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    })
  })
}

export const testChangeTripImageButton = () => {
  describe('写真の変更ボタンクリック時', () => {
    it('写真の変更ができること', async () => {
      await clickFaEllipsis()

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
}

export const testChangePublishSettingsButton = () => {
  describe('公開状態の変更ボタンクリック時', () => {
    it('公開状態の変更ができること', async () => {
      await clickFaEllipsis()

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
}

export const testChangeTitleButton = () => {
  describe('タイトルの変更ボタンクリック時', () => {
    it('タイトルの変更ができること', async () => {
      await clickFaEllipsis()

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
}

export const testChangeDestinationButton = () => {
  describe('旅行先の変更ボタンクリック時', () => {
    it('旅行先の変更ができること', async () => {
      await clickFaEllipsis()

      // 旅行先の変更ボタンをクリック
      fireEvent.click(
        screen.getByRole('button', {
          name: '旅行先の変更',
        })
      )

      // フォームタイトルの確認
      expect(screen.getByText('旅行先変更')).toBeInTheDocument()

      // 旅行先の確認
      const destinationSelect = screen.getByLabelText(
        '旅行先'
      ) as HTMLSelectElement
      expect(destinationSelect.value).toBe('1')

      // 旅行先の設定
      fireEvent.change(screen.getByLabelText('旅行先'), {
        target: { value: '48' },
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
            prefecture_id: 48,
          },
          UPDATE_TRIP_DESTINATION_SUCCESS_MSG,
          UPDATE_TRIP_DESTINATION_ERROR_MSG
        )
      })
    })
  })
}

export const testCopyButton = () => {
  describe('コピーボタンクリック時', () => {
    it('コピーができること', async () => {
      await clickFaEllipsis()

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
}

export const testDeleteButton = () => {
  describe('削除ボタンクリック時', () => {
    it('削除ができること', async () => {
      await clickFaEllipsis()

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
}

export const testCreateTrip = async (buttonName: string) => {
  // 旅行プラン作成ボタンをクリック
  const createTripButton = screen.getByRole('button', {
    name: buttonName,
  })

  await act(async () => {
    fireEvent.click(createTripButton)
  })

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
}
