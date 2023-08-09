import React from 'react'
import { render, screen } from '@testing-library/react'
import Privacy from '@/pages/privacy'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/privacy',
  }),
}))

describe('/privacyアクセス時', () => {
  it('プライバシーポリシーが表示されること', () => {
    render(<Privacy />)

    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
  })
})
