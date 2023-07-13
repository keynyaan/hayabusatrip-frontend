import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SecondaryButton } from '@/components/SecondaryButton'

export const NotFound = () => {
  return (
    <div className="flex flex-col max-w-md items-center mx-auto gap-4 px-4">
      <Image
        src={`${process.env.NEXT_PUBLIC_S3_OBJECT_URL}/utils/error_404_cat_interrupting_work.png`}
        alt={'404エラーページの猫に仕事を邪魔されるイラスト'}
        width={250}
        height={250}
      />
      <p className="text-brand-color text-base sm:text-xl">
        指定されたページが見つかりませんでした
      </p>

      <p className="text-gray-700 text-sm sm:text-base">
        共有されたURLからアクセスした場合、コピーミスがないか確認してください。URLが正しい場合、旅行プランが既に削除・非公開にされている可能性があるため、共有元の相手にご確認ください。
      </p>
      <Link href="/">
        <SecondaryButton text="ホームへ戻る" showHomeIcon={true} />
      </Link>
    </div>
  )
}
