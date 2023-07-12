import Link from 'next/link'
import { Social } from '@/components/Social'
import {
  PRIVACY_PAGE_TITLE,
  SITE_META,
  TERMS_PAGE_TITLE,
} from '@/utils/constants'

const { siteTitle, siteStartYear } = SITE_META

export const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-white border-t border-gray-300 text-gray-700 text-sm space-y-4">
      <ul className="flex justify-center space-x-4">
        <li className="hover:opacity-50 transition">
          <Link href="/terms">{TERMS_PAGE_TITLE}</Link>
        </li>
        <li className="hover:opacity-50 transition">
          <Link href="/privacy">{PRIVACY_PAGE_TITLE}</Link>
        </li>
      </ul>
      <div className="flex justify-center space-x-4">
        <p>{`© ${siteStartYear} ${siteTitle}`}</p>
        <Social />
      </div>
    </footer>
  )
}
