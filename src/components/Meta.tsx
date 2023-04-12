import Head from 'next/head'
import { useRouter } from 'next/router'

import siteImg from 'images/ogp.png'
import { siteMeta } from 'lib/constants'

const { siteTitle, siteDesc, siteUrl, siteLocale, siteType } = siteMeta

type MetaProps = {
  pageTitle?: string
  pageDesc?: string
}

export const Meta = ({ pageTitle, pageDesc }: MetaProps) => {
  //ページのタイトル
  const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle

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
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00aab9" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="msapplication-TileColor" content="#00aab9" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:type" content={siteType} />
      <meta property="og:locale" content={siteLocale} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={imgW} />
      <meta property="og:image:height" content={imgH} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
