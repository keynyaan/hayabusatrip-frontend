import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import { SITE_LOGO, SITE_LOGO_NAME } from '@/utils/constants'

export const Logo: React.FC = () => {
  return (
    <Link href="/">
      <div className="flex items-center">
        <Image
          src={SITE_LOGO.src}
          width={SITE_LOGO.width}
          height={SITE_LOGO.height}
          alt={SITE_LOGO.alt}
          priority
        />
        <Image
          src={SITE_LOGO_NAME.src}
          width={SITE_LOGO_NAME.width}
          height={SITE_LOGO_NAME.height}
          alt={SITE_LOGO_NAME.alt}
          priority
          className="hidden sm:block"
        />
      </div>
    </Link>
  )
}
