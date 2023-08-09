import React from 'react'
import { render, screen } from '@testing-library/react'
import Custom404 from '@/pages/404'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/404',
  }),
}))

describe('/404アクセス時', () => {
  it('ページが見つからない旨が表示されること', () => {
    render(<Custom404 />)

    expect(
      screen.getByText('指定されたページが見つかりませんでした')
    ).toBeInTheDocument()
  })

  it('ホームへ戻るボタンが表示されること', () => {
    render(<Custom404 />)

    const backHomeLink = screen.getByRole('link', { name: 'ホームへ戻る' })
    expect(backHomeLink.getAttribute('href')).toBe('/')
  })
})
