import { Html, Head, Main, NextScript } from 'next/document'

import { SITE_META } from '@/utils/constants'

const { siteLang } = SITE_META

export default function Document() {
  return (
    <Html lang={siteLang}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
