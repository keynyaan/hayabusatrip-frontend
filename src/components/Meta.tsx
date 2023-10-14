import Head from 'next/head'
import { useRouter } from 'next/router'

import siteImg from 'public/images/ogp.png'
import { SITE_META } from '@/utils/constants'
import { useEffect, useState } from 'react'

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
  const [imgUrl, setImgUrl] = useState(siteUrl + siteImg.src)
  const [imgW, setImgW] = useState(String(siteImg.width))
  const [imgH, setImgH] = useState(String(siteImg.height))

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
  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.src = imageUrl
      img.onload = () => {
        setImgUrl(imageUrl)
        setImgW(String(img.width))
        setImgH(String(img.height))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <meta property="og:image:width" content={imgW} />
      <meta property="og:image:height" content={imgH} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="Twitter:site" content={twitterSite} />
    </Head>
  )
}
