import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}))

describe('Home', () => {
  it('hayabusatripが表示されていること', () => {
    render(<Home />)
    expect(screen.getByText('hayabusatrip')).toBeInTheDocument()
  })
})
