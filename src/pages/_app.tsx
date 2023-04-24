import type { AppProps } from 'next/app'
import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import 'tailwindcss/tailwind.css'

import { Layout } from '@/components/Layout'
import '@/styles/globals.css'
import { AuthContextProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'

// Font Awesome の設定
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <AuthContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthContextProvider>
    </ToastProvider>
  )
}
