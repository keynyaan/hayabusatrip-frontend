import { screen, render, fireEvent } from '@testing-library/react'
import {
  configureApiMocks,
  currentUserMock,
  dbTripsDataMock,
  useAuthContextMock,
} from '@/__test__/utils/mocks'
import { Header } from '@/components/Header'
import { MAX_TRIP_DURATION, MAX_TRIP_TITLE_LENGTH } from '@/utils/constants'

const renderCreateTripForm = () => {
  useAuthContextMock.mockReturnValue({
    currentUser: currentUserMock,
    dbTripsData: dbTripsDataMock,
  })

  configureApiMocks()
  render(<Header />)
  fireEvent.click(screen.getByText('旅行プラン作成'))
}

// 正常系のテストはHeader.test.tsxで実施するため、異常系のテストのみ扱う
describe('旅行プラン作成フォーム確認時', () => {
  beforeEach(() => {
    renderCreateTripForm()
  })

  it('旅行タイトルのバリデーションが正しいこと', () => {
    const tripTitle = screen.getByLabelText('旅行タイトル')

    // 上限チェック
    fireEvent.change(tripTitle, {
      target: { value: 'a'.repeat(31) },
    })
    screen.getByText(
      `旅行タイトルは${MAX_TRIP_TITLE_LENGTH}文字以下で入力してください`
    )

    // 空文字チェック
    fireEvent.change(tripTitle, {
      target: { value: '' },
    })
    screen.getByText('旅行タイトルを入力してください')
  })

  it('開始日のバリデーションが正しいこと', () => {
    const startDate = screen.getByLabelText('開始日')

    // 範囲チェック
    fireEvent.change(startDate, {
      target: { value: '1999-12-31' },
    })
    screen.getByText(
      '開始日は2000年1月1日から9999年12月31日の間の日付を入力してください'
    )

    // 空文字チェック
    fireEvent.change(startDate, {
      target: { value: '' },
    })
    screen.getByText('開始日を入力してください')
  })

  it('終了日のバリデーションが正しいこと', () => {
    const startDate = screen.getByLabelText('開始日')
    const endDate = screen.getByLabelText('終了日')

    // 範囲チェック
    fireEvent.change(endDate, {
      target: { value: '1999-12-31' },
    })
    screen.getByText(
      '終了日は2000年1月1日から9999年12月31日の間の日付を入力してください'
    )

    // 空文字チェック
    fireEvent.change(endDate, {
      target: { value: '' },
    })
    screen.getByText('終了日を入力してください')

    // 論理チェック
    fireEvent.change(startDate, {
      target: { value: '2000-01-02' },
    })
    fireEvent.change(endDate, {
      target: { value: '2000-01-01' },
    })
    screen.getByText('終了日は開始日以降の日付を入力してください')

    // 差分チェック
    fireEvent.change(startDate, {
      target: { value: '2000-01-01' },
    })
    fireEvent.change(endDate, {
      target: { value: '2000-01-11' },
    })
    screen.getByText(
      `終了日は開始日から${MAX_TRIP_DURATION}日以内に設定してください`
    )
  })
})
