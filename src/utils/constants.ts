// サイトのメタ情報
export const SITE_META = {
  siteTitle: 'HayabusaTrip',
  siteDesc: ' 旅行計画を作成して共有できるサイト ',
  siteUrl: 'https://www.hayabusatrip.com',
  siteLang: 'ja',
  siteLocale: 'ja_JP',
  siteType: 'website',
}

// サイトロゴの情報
export const SITE_LOGO = {
  src: '/images/logo.png',
  width: 72,
  height: 72,
}

// API実行用のURL
export const USERS_URL = '/users'
export const TRIPS_URL = 'trips'
export const S3_UPLOAD_URL = '/s3/upload'

// ユーザーアイコンのサイズ
export const SETTINGS_USER_ICON_WIDTH = 96
export const SETTINGS_USER_ICON_HEIGHT = 96
export const HEADER_USER_ICON_WIDTH = 48
export const HEADER_USER_ICON_HEIGHT = 48

// アップロードファイルの上限サイズ
export const FILE_SIZE_LIMIT_MB = 5
export const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024

// 有効な日付範囲
export const MIN_DATE = '1000-01-01'
export const MAX_DATE = '9999-12-31'
export const MIN_DATE_OBJ = new Date('1000-01-01')
export const MAX_DATE_OBJ = new Date('9999-12-31')

// フォームの名前
export const FORM_SIGN_UP = '新規登録'
export const FORM_LOGIN = 'ログイン'
export const FORM_PASSWORD_RESET = 'パスワード再設定'
export const FORM_UNSUBSCRIBE = '退会'
export const FORM_CREATE_TRIP = '旅行プラン作成'

// トースト表示用のメッセージ
// userAPI
export const GET_USER_ERROR_MSG = 'ユーザー情報の取得に失敗しました。'
export const CREATE_USER_ERROR_MSG = 'ユーザーの登録に失敗しました。'
export const UPDATE_USER_ERROR_MSG = 'ユーザー情報の更新に失敗しました。'
export const DELETE_USER_ERROR_MSG = 'ユーザーの削除に失敗しました。'
// tripAPI
export const CREATE_TRIP_SUCCESS_MSG = '旅行プランを作成しました。'
export const UPDATE_TRIP_SUCCESS_MSG = '旅行プランを更新しました。'
export const DELETE_TRIP_SUCCESS_MSG = '旅行プランを削除しました。'
export const GET_TRIP_ERROR_MSG = '旅行プランの取得に失敗しました。'
export const CREATE_TRIP_ERROR_MSG = '旅行プランの作成に失敗しました。'
export const UPDATE_TRIP_ERROR_MSG = '旅行プランの更新に失敗しました。'
export const DELETE_TRIP_ERROR_MSG = '旅行プランの削除に失敗しました。'
// s3API
export const UPLOAD_ERROR_MSG = '画像のアップロードに失敗しました。'

// 旅行先の配列
export const TRIP_DESTINATION_ITEMS = [
  { value: '1', name: '北海道' },
  { value: '2', name: '青森県' },
  { value: '3', name: '岩手県' },
  { value: '4', name: '宮城県' },
  { value: '5', name: '秋田県' },
  { value: '6', name: '山形県' },
  { value: '7', name: '福島県' },
  { value: '8', name: '茨城県' },
  { value: '9', name: '栃木県' },
  { value: '10', name: '群馬県' },
  { value: '11', name: '埼玉県' },
  { value: '12', name: '千葉県' },
  { value: '13', name: '東京都' },
  { value: '14', name: '神奈川県' },
  { value: '15', name: '新潟県' },
  { value: '16', name: '富山県' },
  { value: '17', name: '石川県' },
  { value: '18', name: '福井県' },
  { value: '19', name: '山梨県' },
  { value: '20', name: '長野県' },
  { value: '21', name: '岐阜県' },
  { value: '22', name: '静岡県' },
  { value: '23', name: '愛知県' },
  { value: '24', name: '三重県' },
  { value: '25', name: '滋賀県' },
  { value: '26', name: '京都府' },
  { value: '27', name: '大阪府' },
  { value: '28', name: '兵庫県' },
  { value: '29', name: '奈良県' },
  { value: '30', name: '和歌山県' },
  { value: '31', name: '鳥取県' },
  { value: '32', name: '島根県' },
  { value: '33', name: '岡山県' },
  { value: '34', name: '広島県' },
  { value: '35', name: '山口県' },
  { value: '36', name: '徳島県' },
  { value: '37', name: '香川県' },
  { value: '38', name: '愛媛県' },
  { value: '39', name: '高知県' },
  { value: '40', name: '福岡県' },
  { value: '41', name: '佐賀県' },
  { value: '42', name: '長崎県' },
  { value: '43', name: '熊本県' },
  { value: '44', name: '大分県' },
  { value: '45', name: '宮崎県' },
  { value: '46', name: '鹿児島県' },
  { value: '47', name: '沖縄県' },
]
