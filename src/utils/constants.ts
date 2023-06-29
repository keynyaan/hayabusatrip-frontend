import {
  faPlane,
  faTrain,
  faBus,
  faBicycle,
  faWalking,
  faHotel,
  faUtensils,
  faLocationDot,
  faCar,
  faShip,
} from '@fortawesome/free-solid-svg-icons'

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

// HTTPステータスコード
export const HTTP_STATUS_NO_CONTENT = 204

// API実行用のURL
export const USERS_URL = '/users'
export const TRIPS_URL = '/trips'
export const SPOTS_URL = '/spots'
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
export const MIN_DATE = '0001-01-01'
export const MAX_DATE = '9999-12-31'
export const MIN_DATE_OBJ = new Date('0001-01-01')
export const MAX_DATE_OBJ = new Date('9999-12-31')

// フォームの名前
export const FORM_SIGN_UP = '新規登録'
export const FORM_LOGIN = 'ログイン'
export const FORM_PASSWORD_RESET = 'パスワード再設定'
export const FORM_UNSUBSCRIBE = '退会'
export const FORM_CREATE_TRIP = '旅行プラン作成'
export const FORM_TRIP_PHOTO = '旅行写真変更'
export const FORM_TRIP_PUBLISH_SETTINGS = '公開状態変更'
export const FORM_TRIP_TITLE = '旅行タイトル変更'
export const FORM_TRIP_DESTINATION = '旅行先変更'
export const FORM_COPY_TRIP = '旅行プランコピー'
export const FORM_DELETE_TRIP = '旅行プラン削除'
export const FORM_ADD_SPOT = 'スポット追加'
export const FORM_UPDATE_SPOT = 'スポット更新'
export const FORM_DELETE_SPOT = 'スポット削除'
export const FORM_DELETE_TRIP_DATE = '日程削除'

// 旅行タイトルの上限とコピー時の接尾辞
export const MAX_TRIP_TITLE_LENGTH = 30
export const COPY_SUFFIX = 'のコピー'

// スポットフォームのモード
export const SPOT_FORM_MODE_CREATE = 'create'
export const SPOT_FORM_MODE_UPDATE = 'update'

// スポット名の上限値
export const MAX_SPOT_NAME = 30

// 費用の上限値
export const MAX_COST = 99999999
export const MAX_COST_LENGTH = 8

// スポットメモの設定値
export const MAX_SPOT_MEMO = 50
export const SPOT_ROWS = 3

// トースト表示用のメッセージ
// userAPI
export const GET_USER_ERROR_MSG = 'ユーザー情報の取得に失敗しました。'
export const CREATE_USER_ERROR_MSG = 'ユーザーの登録に失敗しました。'
export const UPDATE_USER_ERROR_MSG = 'ユーザー情報の更新に失敗しました。'
export const DELETE_USER_ERROR_MSG = 'ユーザーの削除に失敗しました。'
// tripAPI
export const CREATE_TRIP_SUCCESS_MSG = '旅行プランを作成しました。'
export const COPY_TRIP_SUCCESS_MSG = '旅行プランをコピーしました。'
export const UPDATE_TRIP_SUCCESS_MSG = '旅行プランを更新しました。'
export const DELETE_TRIP_SUCCESS_MSG = '旅行プランを削除しました。'
export const DELETE_TRIP_DATE_SUCCESS_MSG = '旅行日程を削除しました。'
export const GET_TRIP_ERROR_MSG = '旅行プランの取得に失敗しました。'
export const CREATE_TRIP_ERROR_MSG = '旅行プランの作成に失敗しました。'
export const COPY_TRIP_TITLE_ERROR_MSG = `コピー元の旅行タイトルは${
  MAX_TRIP_TITLE_LENGTH - COPY_SUFFIX.length
}文字以下にしてください。`
export const COPY_TRIP_ERROR_MSG = '旅行プランのコピーに失敗しました。'
export const UPDATE_TRIP_ERROR_MSG = '旅行プランの更新に失敗しました。'
export const DELETE_TRIP_ERROR_MSG = '旅行プランの削除に失敗しました。'
export const DELETE_TRIP_DATE_ERROR_MSG = '旅行日程の削除に失敗しました。'
// spotAPI
export const CREATE_SPOT_SUCCESS_MSG = '旅行スポットを作成しました。'
export const UPDATE_SPOT_SUCCESS_MSG = '旅行スポットを更新しました。'
export const DELETE_SPOT_SUCCESS_MSG = '旅行スポットを削除しました。'
export const GET_SPOT_ERROR_MSG = '旅行スポットの取得に失敗しました。'
export const CREATE_SPOT_ERROR_MSG = '旅行スポットの作成に失敗しました。'
export const UPDATE_SPOT_ERROR_MSG = '旅行スポットの更新に失敗しました。'
export const DELETE_SPOT_ERROR_MSG = '旅行スポットの削除に失敗しました。'
// S3API
export const UPLOAD_LOADING_MSG = '画像を更新中です。'
export const UPLOAD_SUCCESS_MSG = '画像を更新しました。'
export const UPLOAD_ERROR_MSG = '画像のアップロードに失敗しました。'

// S3API実行時の保存先ディレクトリ
export const USER_ICONS_DIRECTORY = 'user_icons'
export const TRIP_IMAGES_DIRECTORY = 'trip_images'

// 旅行先の配列
export const TRIP_DESTINATION_ITEMS = [
  { value: '1', name: '北海道', spotName: '白金青い池' },
  { value: '2', name: '青森県', spotName: '三内丸山遺跡' },
  { value: '3', name: '岩手県', spotName: '小岩井農場' },
  { value: '4', name: '宮城県', spotName: '御釜' },
  { value: '5', name: '秋田県', spotName: '田沢湖' },
  { value: '6', name: '山形県', spotName: '銀山温泉' },
  { value: '7', name: '福島県', spotName: '大内宿' },
  { value: '8', name: '茨城県', spotName: '国営ひたち海浜公園' },
  { value: '9', name: '栃木県', spotName: '日光' },
  { value: '10', name: '群馬県', spotName: '四万温泉' },
  { value: '11', name: '埼玉県', spotName: '秩父高原牧場' },
  { value: '12', name: '千葉県', spotName: '佐倉ふるさと広場' },
  { value: '13', name: '東京都', spotName: '東京タワー' },
  { value: '14', name: '神奈川県', spotName: 'みなとみらい' },
  { value: '15', name: '新潟県', spotName: '星峠の棚田' },
  { value: '16', name: '富山県', spotName: '黒部峡谷鉄道' },
  { value: '17', name: '石川県', spotName: '白米千枚田' },
  { value: '18', name: '福井県', spotName: '東尋坊' },
  { value: '19', name: '山梨県', spotName: '山中湖' },
  { value: '20', name: '長野県', spotName: '上高地' },
  { value: '21', name: '岐阜県', spotName: '白川郷' },
  { value: '22', name: '静岡県', spotName: '龍巌淵' },
  { value: '23', name: '愛知県', spotName: '香嵐渓' },
  { value: '24', name: '三重県', spotName: '二見興玉神社' },
  { value: '25', name: '滋賀県', spotName: '白髭神社' },
  { value: '26', name: '京都府', spotName: '清水寺' },
  { value: '27', name: '大阪府', spotName: '道頓堀' },
  { value: '28', name: '兵庫県', spotName: '姫路城' },
  { value: '29', name: '奈良県', spotName: '奈良公園' },
  { value: '30', name: '和歌山県', spotName: '青岸渡寺' },
  { value: '31', name: '鳥取県', spotName: '鳥取砂丘' },
  { value: '32', name: '島根県', spotName: '稲佐の浜' },
  { value: '33', name: '岡山県', spotName: '倉敷美観地区' },
  { value: '34', name: '広島県', spotName: '厳島神社' },
  { value: '35', name: '山口県', spotName: '角島大橋' },
  { value: '36', name: '徳島県', spotName: '祖谷のかずら橋' },
  { value: '37', name: '香川県', spotName: '小豆島オリーブ公園' },
  { value: '38', name: '愛媛県', spotName: '下灘駅' },
  { value: '39', name: '高知県', spotName: '四万十川' },
  { value: '40', name: '福岡県', spotName: '大濠公園' },
  { value: '41', name: '佐賀県', spotName: '吉野ケ里遺跡' },
  { value: '42', name: '長崎県', spotName: '稲佐山公園' },
  { value: '43', name: '熊本県', spotName: '草千里ヶ浜' },
  { value: '44', name: '大分県', spotName: '別府温泉' },
  { value: '45', name: '宮崎県', spotName: 'サンメッセ日南' },
  { value: '46', name: '鹿児島県', spotName: '西大山駅' },
  { value: '47', name: '沖縄県', spotName: '万座毛' },
]

// 公開状態の配列
export const PUBLISH_SETTINGS_ITEMS = [
  { value: 'true', name: '公開' },
  { value: 'false', name: '非公開' },
]

// スポットカテゴリーの配列
export const SPOT_CATEGORY_OPTIONS = [
  {
    value: 'sightseeing',
    label: '観光',
    icon: faLocationDot,
    color: 'bg-red-400',
  },
  { value: 'meal', label: '食事', icon: faUtensils, color: 'bg-orange-400' },
  { value: 'stay', label: '宿泊', icon: faHotel, color: 'bg-violet-400' },
  { value: 'walk', label: '徒歩', icon: faWalking, color: 'bg-blue-400' },
  {
    value: 'bike',
    label: 'バイク',
    icon: faBicycle,
    color: 'bg-blue-400',
  },
  { value: 'car', label: '車', icon: faCar, color: 'bg-blue-400' },
  { value: 'bus', label: 'バス', icon: faBus, color: 'bg-blue-400' },
  { value: 'train', label: '列車', icon: faTrain, color: 'bg-blue-400' },
  { value: 'airplane', label: '飛行機', icon: faPlane, color: 'bg-blue-400' },
  { value: 'ship', label: '船', icon: faShip, color: 'bg-blue-400' },
]
