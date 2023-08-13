import { screen, fireEvent, act } from '@testing-library/react'
import { renderTripDetailWithMock } from '@/__test__/utils/commonTest'
import { configureApiMocks, selectedTripMock } from '@/__test__/utils/mocks'
import { MAX_SPOT_MEMO, MAX_SPOT_NAME } from '@/utils/constants'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: `/trips/${selectedTripMock.trip_token}`,
    query: { trip_token: selectedTripMock.trip_token },
  }),
}))

const renderCreateSpotForm = async () => {
  configureApiMocks()

  await renderTripDetailWithMock()

  // スポット追加をクリック
  await act(async () => {
    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'スポット追加',
      })[0]
    )
  })
}

// 正常系のテストは[trip_token].test.tsxで実施するため、異常系のテストのみ扱う
describe('スポット追加フォーム確認時', () => {
  beforeEach(async () => {
    await renderCreateSpotForm()
  })

  it('スポット名のバリデーションが正しいこと', () => {
    const spotName = screen.getByLabelText('スポット名')

    // 上限チェック
    fireEvent.change(spotName, {
      target: { value: 'a'.repeat(31) },
    })
    screen.getByText(`スポット名は${MAX_SPOT_NAME}文字以下で入力してください`)

    // 空文字チェック
    fireEvent.change(spotName, {
      target: { value: '' },
    })
    screen.getByText('スポット名を入力してください')
  })

  it('開始時間のバリデーションが正しいこと', () => {
    const startDate = screen.getByLabelText('開始時間')

    // 空文字チェック
    fireEvent.change(startDate, {
      target: { value: '' },
    })
    screen.getByText('開始時間を入力してください')
  })

  it('終了時間のバリデーションが正しいこと', () => {
    const startDate = screen.getByLabelText('開始時間')
    const endDate = screen.getByLabelText('終了時間')

    // 空文字チェック
    fireEvent.change(endDate, {
      target: { value: '' },
    })
    screen.getByText('終了時間を入力してください')

    // 論理チェック
    fireEvent.change(startDate, {
      target: { value: '09:01' },
    })
    fireEvent.change(endDate, {
      target: { value: '09:00' },
    })
    screen.getByText('終了時間は開始時間以降の時間を入力してください')
  })

  it('費用のバリデーションが正しいこと', () => {
    const cost = screen.getByLabelText('費用')

    // 上限チェック
    fireEvent.change(cost, {
      target: { value: '100000001' },
    })
    screen.getByText('費用は1億未満の数値を入力してください')

    // 空文字チェック
    fireEvent.change(cost, {
      target: { value: '' },
    })
    screen.getByText('費用を入力してください')
  })

  it('一言メモのバリデーションが正しいこと', () => {
    const spotMemo = screen.getByLabelText('一言メモ')

    // 上限チェック
    fireEvent.change(spotMemo, {
      target: { value: 'a'.repeat(51) },
    })
    screen.getByText(`一言メモは${MAX_SPOT_MEMO}文字以下で入力してください`)
  })
})
