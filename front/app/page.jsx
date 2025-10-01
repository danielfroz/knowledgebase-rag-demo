'use client'

import { Button } from '@/components/ui/button'
import { useAlert } from '@/hooks'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Answer from './Answer'
import Search from './Search'

const Page = () => {
  const alert = useAlert()
  const router = useRouter()
  const [ question, setQuestion ] = useState('')
  const [ answer, setAnswer ] = useState(undefined)

  function reset() {
    setQuestion('')
    setAnswer(undefined)
    alert.info('I am ready to rock! Ask me anything. Don\'t be shy!')
  }

  return (
    <div className='p-4'>
      <Search question={question} setQuestion={setQuestion} setAnswer={setAnswer}/>

      {answer &&
        <div>
          <Answer answer={answer}/>
        </div>
      }

      <div className='flex gap-2 mt-2'>
        <Button onClick={() => reset()}>New Question</Button>
        <Button onClick={() => router.push('/source')}>Manage Sources</Button>
      </div>
    </div>
  )
}

export default Page