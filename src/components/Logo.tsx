import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import { siteLogo } from '@/utils/constants'

const { src, width, height } = siteLogo

export const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src={src}
        width={width}
        height={height}
        alt="サイトのロゴ"
        priority
        className="hover:scale-105 transition-transform"
      />
    </Link>
  )
}
