'use client'

import { useEffect, useState } from "react"

const loadingPhrases = [
  "Please wait while I gather the information...",
  "Got it! let me work on this...",
  "Just a sec while I am checking my records...",
  "Thinking..."
]

export const Loading = () => {
  const [ phrase, setPhrase ] = useState('')

  useEffect(() => {
    const idx = Math.floor(Math.random() * loadingPhrases.length)
    setPhrase(loadingPhrases[idx])
  }, [])

  return (
    <div className='flex gap-2 text-sm'>
      <div className="w-4 h-4 border border-blue-300 border-t-transparent border-solid rounded-full animate-spin"></div>
      {phrase}
    </div>
  )
}