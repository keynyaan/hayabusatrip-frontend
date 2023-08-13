import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import {
  renderTripDetailWithMock,
  setIsTripDetail,
  testChangeDestinationButton,
  testChangePublishSettingsButton,
  testChangeTitleButton,
  testChangeTripImageButton,
  testDeleteButton,
  testDropdownMenu,
} from '@/__test__/utils/commonTest'
import {
  currentUserMock,
  deleteTripDateMock,
  getSpotsMock,
  getTripMock,
  selectedTripMock,
  updateSpotMock,
  updateTripMock,
  scrollMock,
  useSpotApiMock,
  useTripApiMock,
  deleteSpotMock,
  createSpotMock,
  configureApiMocks,
  notTripOwnerMock,
} from '@/__test__/utils/mocks'
import {
  ADD_TRIP_DATE_SUCCESS_MSG,
  ADD_TRIP_DATE_ERROR_MSG,
  UPDATE_TRIP_DATE_ERROR_MSG,
  UPDATE_TRIP_DATE_SUCCESS_MSG,
  UPDATE_SPOT_MIN_BASE_DATE,
  UPDATE_TRIP_MEMO_ERROR_MSG,
  UPDATE_TRIP_MEMO_SUCCESS_MSG,
  MAX_TRIP_MEMO,
} from '@/utils/constants'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: `/trips/${selectedTripMock.trip_token}`,
    query: { trip_token: selectedTripMock.trip_token },
  }),
}))

describe('/trip/[trip_token]アクセス時', () => {
  describe('isDataLoading時', () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    beforeEach(() => {
      getTripMock.mockImplementation(async () => {
        await delay(1000)
        return true
      })

      getSpotsMock.mockImplementation(async () => {
        await delay(1000)
        return true
      })
    })

    it('Spinnerが表示されること', async () => {
      await renderTripDetailWithMock()
      expect(screen.getByTestId('tail-spin-loading')).toBeInTheDocument()
    })
  })

  describe('trip_tokenと一致する旅行データが存在しない時', () => {
    beforeEach(() => {
      getTripMock.mockResolvedValue(false)
      getSpotsMock.mockResolvedValue(true)
    })

    useTripApiMock.mockReturnValue({
      getTrip: getTripMock,
    })

    useSpotApiMock.mockReturnValue({
      getSpots: getSpotsMock,
    })

    it('NotFoundが表示されること', async () => {
      await renderTripDetailWithMock()
      expect(
        screen.getByText('指定されたページが見つかりませんでした')
      ).toBeInTheDocument()
    })
  })

  describe('旅行プラン作成者以外がアクセスした時', () => {
    beforeEach(() => {
      getTripMock.mockResolvedValue(true)
      getSpotsMock.mockResolvedValue(true)
    })

    useTripApiMock.mockReturnValue({
      getTrip: getTripMock,
    })

    useSpotApiMock.mockReturnValue({
      getSpots: getSpotsMock,
    })

    it('閲覧モードが表示されないこと', async () => {
      await renderTripDetailWithMock({
        dbUserData: notTripOwnerMock,
      })

      expect(
        screen.queryByText('閲覧モード', { selector: 'label' })
      ).not.toBeInTheDocument()
    })
  })

  describe('trip_tokenと一致する旅行データが存在する時', () => {
    beforeEach(() => {
      getTripMock.mockResolvedValue(true)
      getSpotsMock.mockResolvedValue(true)
    })

    useTripApiMock.mockReturnValue({
      getTrip: getTripMock,
    })

    useSpotApiMock.mockReturnValue({
      getSpots: getSpotsMock,
    })

    describe('閲覧モードがオフの時', () => {
      describe('TripCardの確認時', () => {
        it('画像と説明が表示されること', async () => {
          await renderTripDetailWithMock()

          // 画像
          expect(
            screen.getByRole('img', {
              name: '北海道旅行の旅行画像',
            })
          ).toHaveAttribute('src', 'hokkaido.jpg')

          // 説明
          expect(document.querySelector('.fa-lock')).toBeInTheDocument()
          expect(screen.getByText('北海道旅行')).toBeInTheDocument()
          expect(screen.getByText('2023/07/01-2023/07/02')).toBeInTheDocument()
          expect(
            screen.getByText('北海道', { selector: 'span' })
          ).toBeInTheDocument()
        })

        describe('TripCardの三点リーダークリック時', () => {
          beforeAll(() => {
            setIsTripDetail(true)
          })

          const buttonNames = [
            '写真の変更',
            '公開状態の変更',
            'タイトルの変更',
            '旅行先の変更',
            '削除',
          ]

          // ドロップダウンメニューの表示テスト
          testDropdownMenu(buttonNames)

          // 各ボタンのテスト
          testChangeTripImageButton()
          testChangePublishSettingsButton()
          testChangeTitleButton()
          testChangeDestinationButton()
          testDeleteButton()
        })
      })

      describe('閲覧モードの確認時', () => {
        it('閲覧モード切替スイッチが表示されること', async () => {
          await renderTripDetailWithMock()

          // 閲覧モード切替スイッチがオフであることを確認
          expect(
            screen.getByRole('switch', { checked: false })
          ).toBeInTheDocument()
        })

        it('はてなボタンが表示されること', async () => {
          await renderTripDetailWithMock()

          // はてなボタンをクリック
          act(() => {
            const questionSvg = document.querySelector('.fa-circle-question')
            if (questionSvg) {
              fireEvent.click(questionSvg)
            } else {
              throw new Error('Question SVG not found')
            }
          })

          // タイトルの表示確認
          expect(screen.getByText('閲覧モードとは？')).toBeInTheDocument()
        })
      })

      describe('旅行タブの確認時', () => {
        it('日付ボタンが動作すること', async () => {
          await renderTripDetailWithMock()

          // 1日目ボタンをクリック
          fireEvent.click(
            screen.getByRole('button', {
              name: '1日目',
            })
          )

          // スクロールされることの確認
          expect(scrollMock).toHaveBeenCalled()
        })

        it('＋ 追加ボタンが動作すること', async () => {
          await renderTripDetailWithMock()

          // ＋ 追加ボタンをクリック
          fireEvent.click(
            screen.getByRole('button', {
              name: '＋ 追加',
            })
          )

          // 実行時のAPIパラメーターの確認
          await waitFor(() => {
            expect(updateTripMock).toHaveBeenCalledWith(
              currentUserMock.getIdToken(),
              currentUserMock.uid,
              selectedTripMock.trip_token,
              {
                end_date: '2023-07-03',
              },
              ADD_TRIP_DATE_SUCCESS_MSG,
              ADD_TRIP_DATE_ERROR_MSG
            )
          })
        })

        it('日付とカレンダーが表示されること', async () => {
          await renderTripDetailWithMock()

          // 日付の確認
          expect(
            screen.getByText('1日目', { selector: 'label' })
          ).toBeInTheDocument()
          expect(
            screen.getByText('2日目', { selector: 'label' })
          ).toBeInTheDocument()
          expect(
            screen.getByRole('button', { name: '07/01(土)' })
          ).toBeInTheDocument()
          expect(
            screen.getByRole('button', { name: '07/02(日)' })
          ).toBeInTheDocument()

          // カレンダーの確認
          const calendarSvgs = document.querySelectorAll('.fa-calendar')
          expect(calendarSvgs.length).toBe(2)

          // カレンダーをクリック
          await act(async () => {
            fireEvent.click(calendarSvgs[0])
          })

          // 日付をクリック
          const selectedDate = screen.getByRole('option', {
            name: 'Choose 2023年7月3日月曜日',
          })

          await act(async () => {
            fireEvent.click(selectedDate)
          })

          // 実行時のAPIパラメーターの確認
          expect(updateTripMock).toHaveBeenCalledWith(
            currentUserMock.getIdToken(),
            currentUserMock.uid,
            selectedTripMock.trip_token,
            {
              start_date: '2023-07-03',
              end_date: '2023-07-04',
            },
            UPDATE_TRIP_DATE_SUCCESS_MSG,
            UPDATE_TRIP_DATE_ERROR_MSG
          )

          expect(updateSpotMock).toHaveBeenCalledWith(
            currentUserMock.getIdToken(),
            currentUserMock.uid,
            selectedTripMock.trip_token,
            undefined,
            undefined,
            UPDATE_SPOT_MIN_BASE_DATE,
            '2',
            true
          )
        })

        it('ゴミ箱が表示されること', async () => {
          await renderTripDetailWithMock()

          // ゴミ箱の確認
          const trashCanSvgs = document.querySelectorAll('.fa-trash-can')
          expect(trashCanSvgs.length).toBe(2)

          // ゴミ箱をクリック
          await act(async () => {
            fireEvent.click(trashCanSvgs[0])
          })

          // フォームの確認
          expect(screen.getByText('日程削除')).toBeInTheDocument()

          // 削除ボタンをクリック
          await act(async () => {
            fireEvent.click(
              screen.getByRole('button', {
                name: '削除',
              })
            )
          })

          // 実行時のAPIパラメーターの確認
          expect(deleteTripDateMock).toHaveBeenCalledWith(
            currentUserMock.getIdToken(),
            currentUserMock.uid,
            selectedTripMock.trip_token,
            '2023-07-01'
          )
        })

        describe('SpotCardの確認時', () => {
          it('表示されること', async () => {
            await renderTripDetailWithMock()

            const spotCards = screen.getAllByTestId('spot-card')
            expect(spotCards.length).toBe(8)

            // 1日目
            expect(spotCards[0].querySelector('.fa-car')).toBeInTheDocument()
            expect(within(spotCards[0]).getByText('09:00')).toBeInTheDocument()
            expect(within(spotCards[0]).getByText('|')).toBeInTheDocument()
            expect(within(spotCards[0]).getByText('12:00')).toBeInTheDocument()
            expect(within(spotCards[0]).getByText('移動')).toBeInTheDocument()
            expect(
              within(spotCards[0]).getByText('レンタカーを事前に予約する')
            ).toBeInTheDocument()

            expect(
              spotCards[1].querySelector('.fa-utensils')
            ).toBeInTheDocument()
            expect(within(spotCards[1]).getByText('12:00')).toBeInTheDocument()
            expect(within(spotCards[1]).getByText('|')).toBeInTheDocument()
            expect(within(spotCards[1]).getByText('13:00')).toBeInTheDocument()
            expect(within(spotCards[1]).getByText('昼食')).toBeInTheDocument()

            expect(
              spotCards[2].querySelector('.fa-location-dot')
            ).toBeInTheDocument()
            expect(within(spotCards[2]).getByText('13:00')).toBeInTheDocument()
            expect(within(spotCards[2]).getByText('|')).toBeInTheDocument()
            expect(within(spotCards[2]).getByText('17:00')).toBeInTheDocument()
            expect(within(spotCards[2]).getByText('観光')).toBeInTheDocument()

            expect(spotCards[3].querySelector('.fa-hotel')).toBeInTheDocument()
            expect(within(spotCards[3]).getByText('17:00')).toBeInTheDocument()
            expect(within(spotCards[3]).getByText('|')).toBeInTheDocument()
            expect(within(spotCards[3]).getByText('18:00')).toBeInTheDocument()
            expect(
              within(spotCards[3]).getByText('チェックイン')
            ).toBeInTheDocument()

            // 2日目
            expect(spotCards[4].querySelector('.fa-hotel')).toBeInTheDocument()
            expect(within(spotCards[4]).getByText('09:00')).toBeInTheDocument()
            expect(within(spotCards[4]).getByText('|')).toBeInTheDocument()
            expect(within(spotCards[4]).getByText('10:00')).toBeInTheDocument()
            expect(
              within(spotCards[4]).getByText('チェックアウト')
            ).toBeInTheDocument()

            expect(
              spotCards[5].querySelector('.fa-utensils')
            ).toBeInTheDocument()
            expect(within(spotCards[5]).getByText('12:00')).toBeInTheDocument()
            expect(within(spotCards[5]).getByText('|')).toBeInTheDocument()
            expect(within(spotCards[5]).getByText('13:00')).toBeInTheDocument()
            expect(within(spotCards[5]).getByText('昼食')).toBeInTheDocument()

            expect(
              spotCards[6].querySelector('.fa-location-dot')
            ).toBeInTheDocument()
            expect(within(spotCards[6]).getByText('13:00')).toBeInTheDocument()
            expect(within(spotCards[6]).getByText('|')).toBeInTheDocument()
            expect(within(spotCards[6]).getByText('17:00')).toBeInTheDocument()
            expect(within(spotCards[6]).getByText('観光')).toBeInTheDocument()

            expect(spotCards[7].querySelector('.fa-car')).toBeInTheDocument()
            expect(within(spotCards[7]).getByText('17:00')).toBeInTheDocument()
            expect(within(spotCards[7]).getByText('|')).toBeInTheDocument()
            expect(within(spotCards[7]).getByText('20:00')).toBeInTheDocument()
            expect(within(spotCards[7]).getByText('帰宅')).toBeInTheDocument()
          })

          it('更新できること', async () => {
            await renderTripDetailWithMock()

            // SpotCardをクリック
            await act(async () => {
              fireEvent.click(screen.getAllByTestId('spot-card')[0])
            })

            // 初期値の確認
            expect(screen.getByLabelText('日付')).toHaveValue('2023-07-01')
            expect(screen.getByLabelText('スポット名')).toHaveValue('移動')
            expect(document.querySelector('#spot-category')).toHaveTextContent(
              '車'
            )
            expect(document.querySelector('.fa-car')).toBeInTheDocument()
            expect(screen.getByLabelText('開始時間')).toHaveValue('09:00')
            expect(screen.getByLabelText('終了時間')).toHaveValue('12:00')
            expect(screen.getByLabelText('費用')).toHaveValue('15000')
            expect(screen.getByLabelText('一言メモ')).toHaveTextContent(
              'レンタカーを事前に予約する'
            )

            // 更新ボタンがdisabledであることの確認
            const updateButton = screen.getByRole('button', {
              name: '更新',
            })
            expect(updateButton).toBeDisabled()

            // スポット名の設定
            fireEvent.change(screen.getByLabelText('スポット名'), {
              target: { value: '徒歩で移動' },
            })

            // カテゴリーの設定
            fireEvent.click(screen.getByText('カテゴリー'))
            fireEvent.click(screen.getByText('徒歩'))

            // 開始時間の設定
            fireEvent.change(screen.getByLabelText('開始時間'), {
              target: { value: '06:00' },
            })

            // 終了時間の設定
            fireEvent.change(screen.getByLabelText('終了時間'), {
              target: { value: '11:30' },
            })

            // 費用の設定
            fireEvent.change(screen.getByLabelText('費用'), {
              target: { value: '1000' },
            })

            // 一言メモの設定
            fireEvent.change(screen.getByLabelText('一言メモ'), {
              target: { value: '徒歩で移動する' },
            })

            // 更新ボタンがdisabledでないことの確認
            expect(updateButton).not.toBeDisabled()

            // 更新ボタンをクリック
            fireEvent.click(updateButton)

            // 実行時のAPIパラメーターの確認
            await waitFor(() => {
              expect(updateSpotMock).toHaveBeenCalledWith(
                currentUserMock.getIdToken(),
                currentUserMock.uid,
                selectedTripMock.trip_token,
                selectedTripMock.id,
                {
                  category: 'walk',
                  name: '徒歩で移動',
                  date: '2023-07-01',
                  start_time: '06:00',
                  end_time: '11:30',
                  cost: 1000,
                  memo: '徒歩で移動する',
                }
              )
            })
          })

          it('削除できること', async () => {
            await renderTripDetailWithMock()

            // X印をクリック
            await act(async () => {
              fireEvent.click(document.querySelectorAll('.fa-xmark')[0])
            })

            // 初期値の確認
            expect(
              screen.getByText('「移動」を削除します。')
            ).toBeInTheDocument()

            // 削除ボタンをクリック
            fireEvent.click(
              screen.getByRole('button', {
                name: '削除',
              })
            )

            // 実行時のAPIパラメーターの確認
            await waitFor(() => {
              expect(deleteSpotMock).toHaveBeenCalledWith(
                currentUserMock.getIdToken(),
                currentUserMock.uid,
                selectedTripMock.trip_token,
                selectedTripMock.id
              )
            })
          })

          it('追加できること', async () => {
            await renderTripDetailWithMock()

            // スポット追加をクリック
            await act(async () => {
              fireEvent.click(
                screen.getAllByRole('button', {
                  name: 'スポット追加',
                })[0]
              )
            })

            // 初期値の確認
            expect(screen.getByLabelText('日付')).toHaveValue('2023-07-01')
            expect(screen.getByLabelText('スポット名')).toHaveValue('')
            expect(document.querySelector('#spot-category')).toHaveTextContent(
              '観光'
            )
            expect(
              document.querySelector('.fa-location-dot')
            ).toBeInTheDocument()
            expect(screen.getByLabelText('費用')).toHaveValue('0')
            expect(screen.getByLabelText('一言メモ')).toHaveTextContent('')

            // 追加ボタンがdisabledであることの確認
            const addButton = screen.getByRole('button', {
              name: '追加',
            })
            expect(addButton).toBeDisabled()

            // スポット名の設定
            fireEvent.change(screen.getByLabelText('スポット名'), {
              target: { value: '徒歩で移動' },
            })

            // カテゴリーの設定
            fireEvent.click(screen.getByText('カテゴリー'))
            fireEvent.click(screen.getByText('徒歩'))

            // 開始時間の設定
            fireEvent.change(screen.getByLabelText('開始時間'), {
              target: { value: '06:00' },
            })

            // 終了時間の設定
            fireEvent.change(screen.getByLabelText('終了時間'), {
              target: { value: '11:30' },
            })

            // 費用の設定
            fireEvent.change(screen.getByLabelText('費用'), {
              target: { value: '1000' },
            })

            // 一言メモの設定
            fireEvent.change(screen.getByLabelText('一言メモ'), {
              target: { value: '徒歩で移動する' },
            })

            // 追加ボタンがdisabledでないことの確認
            expect(addButton).not.toBeDisabled()

            // 追加ボタンをクリック
            fireEvent.click(addButton)

            // 実行時のAPIパラメーターの確認
            await waitFor(() => {
              expect(createSpotMock).toHaveBeenCalledWith(
                currentUserMock.getIdToken(),
                currentUserMock.uid,
                selectedTripMock.trip_token,
                {
                  trip_id: selectedTripMock.id,
                  category: 'walk',
                  name: '徒歩で移動',
                  date: '2023-07-01',
                  start_time: '06:00',
                  end_time: '11:30',
                  cost: 1000,
                  memo: '徒歩で移動する',
                }
              )
            })
          })
        })
      })

      describe('費用タブの確認時', () => {
        it('費用が表示されること', async () => {
          await renderTripDetailWithMock()

          // 費用をクリック
          await act(async () => {
            fireEvent.click(screen.getByText('費用'))
          })

          // 下矢印アイコンの確認
          const angelDownSvgs = document.querySelectorAll('.fa-angle-down')
          expect(angelDownSvgs.length).toBe(5)

          // 下矢印アイコンクリックで、上矢印アイコンに変更されることの確認
          fireEvent.click(screen.getByText('観光費'))
          expect(document.querySelector('.fa-angle-up')).toBeInTheDocument()

          // 各費用アイコンの確認
          expect(document.querySelector('.fa-location-dot')).toBeInTheDocument()
          expect(screen.getByText('観光費')).toBeInTheDocument()
          expect(document.querySelector('.fa-utensils')).toBeInTheDocument()
          expect(screen.getByText('食費')).toBeInTheDocument()
          expect(document.querySelector('.fa-hotel')).toBeInTheDocument()
          expect(screen.getByText('宿泊費')).toBeInTheDocument()
          expect(document.querySelector('.fa-car')).toBeInTheDocument()
          expect(screen.getByText('交通費')).toBeInTheDocument()
          expect(document.querySelector('.fa-coins')).toBeInTheDocument()
          expect(screen.getByText('合計')).toBeInTheDocument()

          // 合計金額の確認
          expect(screen.getByText('¥31000')).toBeInTheDocument()

          // 内訳の確認
          const details = screen.queryAllByText('【内訳】')
          expect(details.length).toBe(5)

          const totalDetailDiv = details[4].closest('div')
          if (totalDetailDiv == null) {
            throw new Error('totalDetailDiv not found')
          }

          const texts = [
            '【内訳】',
            '1日目',
            '07/01(土)',
            '移動',
            '¥15000',
            '昼食',
            '¥1000',
            '観光',
            '¥2000',
            'チェックイン',
            '¥10000',
            '2日目',
            '07/02(日)',
            'チェックアウト',
            '¥0',
            '昼食',
            '¥1000',
            '観光',
            '¥2000',
            '帰宅',
            '¥0',
          ]

          // div内の全てのテキストノードを取得
          const allTextsInDiv = Array.from(
            totalDetailDiv.querySelectorAll('p')
          ).map((el) => el.textContent?.trim())

          // 順番通りにテキストが存在するか確認
          texts.forEach((text, index) => {
            expect(allTextsInDiv[index]).toBe(text)
          })
        })
      })

      describe('メモタブの確認時', () => {
        it('メモが表示されること', async () => {
          await renderTripDetailWithMock()

          // メモをクリック
          await act(async () => {
            fireEvent.click(screen.getByText('メモ'))
          })

          // 初期値の確認
          expect(screen.getByLabelText('メモ')).toHaveValue('')

          // 更新ボタンがdisabledであることの確認
          const updateButton = screen.getByRole('button', {
            name: '更新',
          })
          expect(updateButton).toBeDisabled()

          // 上限チェック
          fireEvent.change(screen.getByLabelText('メモ'), {
            target: { value: 'a'.repeat(1001) },
          })
          screen.getByText(`メモは${MAX_TRIP_MEMO}文字以下で入力してください`)

          // メモの設定
          fireEvent.change(screen.getByLabelText('メモ'), {
            target: { value: '旅行のメモ' },
          })

          // 更新ボタンがdisabledでないことの確認
          expect(updateButton).not.toBeDisabled()

          // 更新ボタンをクリック
          configureApiMocks()
          fireEvent.click(updateButton)

          // 実行時のAPIパラメーターの確認
          await waitFor(() => {
            expect(updateTripMock).toHaveBeenCalledWith(
              currentUserMock.getIdToken(),
              currentUserMock.uid,
              selectedTripMock.trip_token,
              {
                memo: '旅行のメモ',
              },
              UPDATE_TRIP_MEMO_SUCCESS_MSG,
              UPDATE_TRIP_MEMO_ERROR_MSG
            )
          })
        })
      })
    })

    describe('閲覧モードがオンの時', () => {
      beforeEach(async () => {
        await renderTripDetailWithMock()

        // 閲覧モード切替スイッチをオンに変更
        await act(async () => {
          fireEvent.click(screen.getByRole('switch', { checked: false }))
        })
      })

      describe('TripCardの確認時', () => {
        it('三点リーダーが表示されないこと', async () => {
          expect(document.querySelector('.fa-ellipsis')).not.toBeInTheDocument()
        })

        it('鍵アイコンが表示されないこと', async () => {
          expect(document.querySelector('.fa-lock')).not.toBeInTheDocument()
        })
      })

      describe('閲覧モードの確認時', () => {
        it('閲覧モード切替スイッチがオンであること', async () => {
          expect(
            screen.getByRole('switch', { checked: true })
          ).toBeInTheDocument()
        })
      })

      describe('旅行タブの確認時', () => {
        it('日付追加ボタンが表示されないこと', async () => {
          expect(
            screen.queryByRole('button', { name: '＋ 追加' })
          ).not.toBeInTheDocument()
        })

        it('カレンダーが表示されないこと', async () => {
          expect(document.querySelector('.fa-calendar')).not.toBeInTheDocument()
        })

        it('ゴミ箱が表示されないこと', async () => {
          expect(
            document.querySelector('.fa-trash-can')
          ).not.toBeInTheDocument()
        })

        it('X印が表示されないこと', async () => {
          expect(document.querySelector('.fa-xmark')).not.toBeInTheDocument()
        })

        it('スポット追加ボタンが表示されないこと', async () => {
          expect(
            screen.queryByRole('button', { name: 'スポット追加' })
          ).not.toBeInTheDocument()
        })
      })

      describe('メモタブの確認時', () => {
        it('更新ボタンが表示されないこと', async () => {
          // メモをクリック
          await act(async () => {
            fireEvent.click(screen.getByText('メモ'))
          })

          // 更新ボタンが表示されないことの確認
          expect(
            screen.queryByRole('button', { name: '更新' })
          ).not.toBeInTheDocument()
        })
      })
    })
  })
})
