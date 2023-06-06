import React from 'react'
import { render } from '@testing-library/react'
import Home from '@/pages/index'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}))

describe('Home', () => {
  it('Homeが表示されていること', () => {
    render(<Home />)
  })
})
