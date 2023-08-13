import { screen } from '@testing-library/react'
import {
  renderHomeWithMock,
  setIsHome,
  testChangePublishSettingsButton,
  testChangeTitleButton,
  testChangeTripImageButton,
  testCopyButton,
  testCreateTrip,
  testDeleteButton,
  testDropdownMenu,
} from '@/__test__/utils/commonTest'
import {
  currentUserMock,
  dbUserDataMock,
  dbTripsDataMock,
  configureApiMocks,
} from '@/__test__/utils/mocks'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}))

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
      configureApiMocks()

      renderHomeWithMock({
        currentUser: currentUserMock,
        dbUserData: dbUserDataMock,
        dbTripsData: [],
        filteredData: [],
      })

      await testCreateTrip('さっそく準備する！')
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
        expect(
          screen.getByRole('img', { name: '北海道旅行の旅行画像' })
        ).toHaveAttribute('src', 'hokkaido.jpg')
        expect(image.closest('a')).toHaveAttribute(
          'href',
          '/trips/tripTokenMock'
        )
        expect(document.querySelector('.fa-lock')).toBeInTheDocument()
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
        beforeAll(() => {
          setIsHome(true)
        })

        const buttonNames = [
          '写真の変更',
          '公開状態の変更',
          'タイトルの変更',
          'コピー',
          '削除',
        ]
        // ドロップダウンメニューの表示テスト
        testDropdownMenu(buttonNames)

        // 各ボタンのテスト
        testChangeTripImageButton()
        testChangePublishSettingsButton()
        testChangeTitleButton()
        testCopyButton()
        testDeleteButton()
      })
    })
  })
})
