import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import { SITE_LOGO, SITE_META } from '@/utils/constants'

const { src, width, height } = SITE_LOGO

export const Logo: React.FC = () => {
  return (
    <Link href="/">
      <div className="flex items-center space-x-2">
        <Image
          src={src}
          width={width}
          height={height}
          alt="サイトのロゴ"
          priority
          className="hover:scale-105 transition"
        />
        <p
          className="hidden sm:block text-brand-color text-3xl"
          style={{ fontFamily: 'Futura' }}
        >
          {SITE_META.siteTitle}
        </p>
      </div>
    </Link>
  )
}
