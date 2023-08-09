import React from 'react'
import { render, screen } from '@testing-library/react'
import Custom500 from '@/pages/500'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/500',
  }),
}))

describe('/500アクセス時', () => {
  it('サーバーエラーが発生した旨が表示されること', () => {
    render(<Custom500 />)

    expect(screen.getByText('サーバーエラーが発生しました')).toBeInTheDocument()
  })

  it('ホームへ戻るボタンが表示されること', () => {
    render(<Custom500 />)

    const backHomeLink = screen.getByRole('link', { name: 'ホームへ戻る' })
    expect(backHomeLink.getAttribute('href')).toBe('/')
  })
})
