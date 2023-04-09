import type { NextPage } from 'next'
import React from 'react'
import { toast } from 'react-toastify'

const handleClick = () => {
  toast.success('ボタンがクリックされました！')
}

const About: NextPage = () => {
  return (
    <div>
      <h1 className="text-blue-700 underline decoration-gray-500">
        Hello World!
      </h1>
      <p>Hello GitHub Actions!</p>
      <button onClick={handleClick}>ボタン</button>
    </div>
  )
}

export default About
