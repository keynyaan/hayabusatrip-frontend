import React from 'react'
import { render, screen } from '@testing-library/react'
import Terms from '@/pages/terms'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/terms',
  }),
}))

describe('/termsアクセス時', () => {
  it('利用規約が表示されること', () => {
    render(<Terms />)

    expect(screen.getByText('利用規約')).toBeInTheDocument()
  })
})
