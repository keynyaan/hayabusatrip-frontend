import React from 'react'
import { Button } from '@/components/Button'

export const AuthButtons: React.FC = () => {
  return (
    <div className="space-x-4">
      <Button
        to="/login"
        label="ログイン"
        className="text-brand-color hover:bg-brand-color hover:bg-opacity-20"
      />
      <Button
        to="/signup"
        label="新規登録"
        className="bg-brand-color text-white hover:bg-opacity-80"
      />
    </div>
  )
}
