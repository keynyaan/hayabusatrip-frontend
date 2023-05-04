import Link from 'next/link'
import { Social } from '@/components/Social'

export const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-gray-100 border-t border-gray-300 opacity-80">
      <ul className="flex justify-center space-x-4 mb-4">
        <li className="hover:opacity-50 transition-opacity">
          <Link href="/terms">利用規約</Link>
        </li>
        <li className="hover:opacity-50 transition-opacity">
          <Link href="/privacy">プライバシーポリシー</Link>
        </li>
      </ul>
      <div className="flex justify-center space-x-4">
        <p>© 2023 HayabusaTrip</p>
        <Social />
      </div>
    </footer>
  )
}
