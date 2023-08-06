import { useState } from 'react'
import Image from 'next/image'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { AuthModal } from '@/components/AuthModal'
import eyecatch_background_white_cloudy_blue_sky from 'public/images/eyecatch_background_white_cloudy_blue_sky.png'
import eyecatch_brand_message_and_iPhone14 from 'public/images/eyecatch_brand_message_and_iPhone14.png'
import iPhone14_trip from 'public/images/iPhone14_trip.png'
import iPhone14_cost from 'public/images/iPhone14_cost.png'
import iPhone14_memo from 'public/images/iPhone14_memo.png'
import iPhone14_create_trip from 'public/images/iPhone14_create_trip.png'
import iPhone14_add_spot from 'public/images/iPhone14_add_spot.png'
import iPhone14_publish_settings from 'public/images/iPhone14_publish_settings.png'
import {
  FORM_SIGN_UP,
  FORM_SIGN_UP_FREE,
  SITE_LOGO_NAME,
  SITE_META,
} from '@/utils/constants'

type ImageSource = {
  src: string
  width: number
  height: number
}

type CustomImageProps = {
  img: ImageSource
  alt: string
  className?: string
  priority?: boolean
}

type ProcessStepProps = {
  stepNumber: number
  img: ImageSource
  alt: string
  description: string
}

type TwitterLinkProps = {
  label: string
  className?: string
}

export const LP = () => {
  const { siteTitle, brandMessage, siteUrl, twitterText } = SITE_META
  const [signUpModalOpen, setSignUpModalOpen] = useState(false)

  const onOpenSignUpModal = () => {
    setSignUpModalOpen(true)
  }
  const onCloseSignUpModal = () => {
    setSignUpModalOpen(false)
  }

  const CustomImage: React.FC<CustomImageProps> = ({
    img,
    alt,
    className,
    priority,
  }) => (
    <Image
      src={img.src}
      alt={alt}
      width={img.width}
      height={img.height}
      className={className}
      priority={priority}
    />
  )

  const ProcessStep: React.FC<ProcessStepProps> = ({
    stepNumber,
    img,
    alt,
    description,
  }) => (
    <div className="w-1/3 min-w-[180px] space-y-2 flex flex-col items-center justify-center">
      <p className="text-3xl sm:text-4xl text-brand-color font-light">
        {stepNumber}
      </p>
      <div className="p-4 bg-brand-color-opacity-20 rounded-3xl space-y-4">
        <CustomImage img={img} alt={alt} className="mx-auto" />
        <p className="text-gray-700 text-sm sm:text-base">{description}</p>
      </div>
    </div>
  )

  const TwitterLink: React.FC<TwitterLinkProps> = ({ label, className }) => (
    <a
      href={`https://twitter.com/intent/tweet?&hashtags=${siteTitle}&text=${twitterText}&url=${siteUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <span className="sr-only">Twitterでシェア</span>
      <FontAwesomeIcon icon={faTwitter} className="mr-2" />
      {label}
    </a>
  )

  return (
    <div>
      <div className="relative p-4 pb-0">
        <Image
          src={eyecatch_background_white_cloudy_blue_sky.src}
          fill
          alt="青い空に白い雲が浮かんでいる背景"
          style={{
            objectFit: 'cover',
          }}
          priority
        />
        <CustomImage
          img={eyecatch_brand_message_and_iPhone14}
          alt={`「${brandMessage}」と旅行詳細画面が表示されたiPhone14`}
          className="relative mx-auto w-full max-w-[800px]"
        />
      </div>
      <div className="max-w-5xl px-4 mx-auto my-8 space-y-8">
        <div className="space-y-4 text-center">
          <div>
            <CustomImage
              img={SITE_LOGO_NAME}
              alt={SITE_LOGO_NAME.alt}
              className="w-[300px] mx-auto"
            />
            <p className="text-gray-500 text-lg sm:text-xl">
              旅行プラン共有サービス
            </p>
          </div>
          <p className="text-gray-700 text-base sm:text-lg">
            {siteTitle}
            は、誰でも簡単に旅行プランを作成・共有できるサービスです。
            <br />
            あなたの旅行が素晴らしい思い出になるようにサポートします。
          </p>
          <SimpleBar>
            <div className="w-full flex items-center space-x-4 sm:space-x-8">
              <CustomImage
                img={iPhone14_trip}
                alt={'旅行詳細画面(旅行)が表示されたiphone14'}
                className="p-4 w-1/3 min-w-[180px]"
              />
              <CustomImage
                img={iPhone14_cost}
                alt={'旅行詳細画面(費用)が表示されたiphone14'}
                className="p-4 w-1/3 min-w-[180px]"
              />
              <CustomImage
                img={iPhone14_memo}
                alt={'旅行詳細画面(メモ)が表示されたiphone14'}
                className="p-4 w-1/3 min-w-[180px]"
              />
            </div>
          </SimpleBar>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl text-brand-color text-center">
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            旅行プラン共有の手順
          </h2>
          <SimpleBar className="pb-4">
            <div className="w-full flex items-center space-x-4 sm:space-x-8">
              <ProcessStep
                stepNumber={1}
                img={iPhone14_create_trip}
                alt={'旅行プラン作成フォームが表示されたiphone14'}
                description={
                  'まずは、旅行プラン作成ボタンを押して、各旅行情報を記入後に作成ボタンを押す。'
                }
              />
              <ProcessStep
                stepNumber={2}
                img={iPhone14_add_spot}
                alt={'スポット追加フォームが表示されたiphone14'}
                description={
                  '次に、スポット追加ボタンを押して、各スポット情報を記入後に追加ボタンを押す。'
                }
              />
              <ProcessStep
                stepNumber={3}
                img={iPhone14_publish_settings}
                alt={'公開状態変更フォームが表示されたiphone14'}
                description={
                  '最後に、三点リーダーから公開状態の変更ボタンを押して、公開に変更したら完了！'
                }
              />
            </div>
          </SimpleBar>
        </div>
        <div>
          <div className="p-4 space-y-4 flex flex-col items-center justify-center bg-white rounded-3xl shadow">
            <h2 className="text-3xl sm:text-4xl text-brand-color">
              <FontAwesomeIcon icon={faEnvelopeOpen} className="mr-2" />
              開発者のメッセージ
            </h2>
            <p className="text-sm leading-8 sm:text-base sm:leading-10 text-gray-700">
              {siteTitle}
              にアクセスいただきありがとうございます！開発者のきいなと申します。
              <br />
              このサービスは、旅行の度にメモアプリで旅のしおりを書いて、それを友達に共有していた経験から、もっと簡単に分かりやすい旅行プランを共有したいと思い作られました。
              <br />
              他の多機能な旅行系サービスに比べると、シンプルな作りになっていますが、その分、デザインや使いやすさに力を入れて開発しました。
              <br />「{siteTitle}
              」というサービス名には、ユーザーがハヤブサのように素早く旅行プランを作成できるようにという想いが込められています。
              <br />
              {siteTitle}
              を使うことで、皆さんの旅行が快適になれば、開発者としてはこの上ない喜びです。
              <br />
              よかったら、ハッシュタグ
              <span className="font-semibold text-brand-color">
                #{siteTitle}
              </span>
              を使って、Twitterで使ってみた感想を教えてください！
              <br />
              それでは、皆さんの旅行が素晴らしい思い出になることを祈っています！
            </p>
            <TwitterLink
              label="ツイート"
              className="rounded px-4 py-2 text-xs sm:text-sm bg-twitter-color text-white hover:bg-opacity-80 transition"
            />
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={onOpenSignUpModal}
            className="px-8 py-4 rounded-full text-xl sm:text-2xl bg-brand-color text-white hover:bg-opacity-80 transition"
          >
            {FORM_SIGN_UP_FREE}
          </button>
          {signUpModalOpen && (
            <AuthModal
              open={signUpModalOpen}
              onClose={onCloseSignUpModal}
              form={FORM_SIGN_UP}
            />
          )}
        </div>
      </div>
    </div>
  )
}
