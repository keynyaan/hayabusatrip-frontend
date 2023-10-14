import Head from 'next/head'
import { useRouter } from 'next/router'

import siteImg from 'public/images/ogp.png'
import { SITE_META } from '@/utils/constants'

const {
  siteTitle,
  brandMessage,
  siteDesc,
  siteUrl,
  siteLocale,
  siteType,
  twitterCard,
  twitterSite,
} = SITE_META

type MetaProps = {
  pageTitle?: string
  pageDesc?: string
  imageUrl?: string
}

export const Meta = ({ pageTitle, pageDesc, imageUrl }: MetaProps) => {
  //ページのタイトル
  const title = pageTitle
    ? `${pageTitle} | ${siteTitle}`
    : `${siteTitle} | ${brandMessage}`

  // ページの説明
  const desc = pageDesc ?? siteDesc

  // ページのURL
  const router = useRouter()
  const url = `${siteUrl}${router.asPath}`

  // OGP画像のサイズ設定
  const imgUrl = imageUrl ?? `${siteUrl}${siteImg.src}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:type" content={siteType} />
      <meta property="og:locale" content={siteLocale} />
      <meta property="og:image" content={imgUrl} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="Twitter:site" content={twitterSite} />
    </Head>
  )
}
