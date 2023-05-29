import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}))

describe('Home', () => {
  it('未ログインが表示されていること', () => {
    render(<Home />)
    expect(screen.getByText('未ログイン')).toBeInTheDocument()
  })
})
