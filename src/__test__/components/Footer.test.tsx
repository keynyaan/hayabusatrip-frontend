import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/Footer'

describe('フッター確認時', () => {
  beforeEach(async () => {
    render(<Footer />)
  })

  it('利用規約のリンクが正しいこと', () => {
    expect(screen.getByRole('link', { name: '利用規約' })).toHaveAttribute(
      'href',
      '/terms'
    )
  })

  it('プライバシーポリシーのリンクが正しいこと', () => {
    expect(
      screen.getByRole('link', {
        name: 'プライバシーポリシー',
      })
    ).toHaveAttribute('href', '/privacy')
  })

  it('コピーライトが正しいこと', () => {
    expect(screen.getByText('© 2023 HayabusaTrip')).toBeInTheDocument()
  })

  it('Twitterのリンクが正しいこと', () => {
    expect(
      screen.getByRole('link', {
        name: 'Twitter',
      })
    ).toHaveAttribute('href', 'https://twitter.com/keynyaan/')
  })

  it('GitHubのリンクが正しいこと', () => {
    expect(
      screen.getByRole('link', {
        name: 'GitHub',
      })
    ).toHaveAttribute(
      'href',
      'https://github.com/keynyaan/hayabusatrip-frontend/'
    )
  })
})
