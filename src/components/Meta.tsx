import Head from 'next/head'
import { useRouter } from 'next/router'

import thumbnailImg from 'public/images/thumbnail.png'
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
}

export const Meta = ({ pageTitle, pageDesc }: MetaProps) => {
  // サムネイル
  const thumbnail = `${siteUrl}${thumbnailImg.src}`

  //ページのタイトル
  const title = pageTitle
    ? `${pageTitle} | ${siteTitle}`
    : `${siteTitle} | ${brandMessage}`

  // ページの説明
  const desc = pageDesc ?? siteDesc

  // ページのURL
  const router = useRouter()
  const url = `${siteUrl}${router.asPath}`

  // OGP画像
  const img = siteImg.src
  const imgW = String(siteImg.width)
  const imgH = String(siteImg.height)
  const imgUrl = `${siteUrl}${img}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta name="thumbnail" content={thumbnail} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:type" content={siteType} />
      <meta property="og:locale" content={siteLocale} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={imgW} />
      <meta property="og:image:height" content={imgH} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="Twitter:site" content={twitterSite} />
    </Head>
  )
}
