'use client'

import { useRouter } from "next/navigation"

export const Logo = () => {
  const router = useRouter()
  return (
    <div className='m-2 cursor-pointer' onClick={() => router.replace('/')}>
      <div className='text-2xl'>
        Knowledge Base Demo
      </div>
    </div>
  )
}