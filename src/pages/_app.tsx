import '@/styles/globals.css';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import React from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
