import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SecondaryButton } from '@/components/SecondaryButton'

export const ServerError = () => {
  return (
    <div className="flex flex-col max-w-md items-center mx-auto gap-4 px-4">
      <Image
        src={`${process.env.NEXT_PUBLIC_S3_OBJECT_URL}/utils/error_500_dirty_child_and_dog.png`}
        alt={'500エラーページの汚れた子供と犬のイラスト'}
        width={250}
        height={250}
      />
      <p className="text-brand-color text-base sm:text-xl">
        サーバーエラーが発生しました
      </p>

      <p className="text-gray-700 text-sm sm:text-base">
        何らかの理由でサーバーが応答していません。時間をおいて再度アクセスするか、サイトの管理者にお問い合わせください。
      </p>
      <Link href="/">
        <SecondaryButton text="ホームへ戻る" showHomeIcon={true} />
      </Link>
    </div>
  )
}
