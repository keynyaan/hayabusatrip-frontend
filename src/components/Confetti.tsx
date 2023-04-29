import React, { useState, useEffect } from 'react'
import ReactConfetti from 'react-confetti'

export const Confetti: React.FC = () => {
  const [isRecycle, setIsRecycle] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)

    const confettiTimeout = setTimeout(() => {
      setIsRecycle(false)
    }, 5000)

    return () => {
      window.removeEventListener('resize', updateWindowSize)
      clearTimeout(confettiTimeout)
    }
  }, [])

  return (
    <ReactConfetti
      recycle={isRecycle}
      width={windowSize.width}
      height={windowSize.height}
    />
  )
}
