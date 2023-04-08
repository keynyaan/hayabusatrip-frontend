import '@/styles/globals.css'
import 'tailwindcss/tailwind.css'
import axios from 'axios'
import type { AppProps } from 'next/app'
import React from 'react'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
