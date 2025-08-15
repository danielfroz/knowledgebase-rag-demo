'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Sources from './Sources'
import Upload from "./Upload"

const Page = () => {
  const router = useRouter()
  const [ showUpload, setShowUpload ] = useState(false)

  return (
    <>
      <div className='flex gap-2'>
        <Button onClick={() => router.push('/')}>Back to questions</Button>
        {!showUpload &&
          <Button onClick={() => setShowUpload(!showUpload)}>Upload Document</Button>
        }
      </div>

      {showUpload &&
        <Upload dismiss={() => setShowUpload(false)}/>
      }

      <Sources/>
    </>
  )
}
export default Page