'use client'

import { Loading } from "@/components"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAlert, useApi } from "@/hooks"
import { useState } from "react"
import { v4 } from "uuid"

const Search = ({ question, setQuestion, setAnswer }) => {
  const api = useApi()
  const alert = useAlert()
  const [ rerank, setRerank ] = useState(true)
  const [ loading, setLoading ] = useState(false)

  function search() {
    setLoading(true)
    const id = v4()
    const query = {
      id,
      sid: id,
      question,
      rerank
    }
    api.post('/api/kb/search', query)
      .then(res => {
        setLoading(false)
        console.log('res: ', res)
        setAnswer(res.answer)
      })
      .catch(error => {
        alert.error(error)
        setLoading(false)
      })
  }

  return (
    <form onSubmit={e => {
      e.preventDefault()
      search()
    }}>
      <div className='grid grid-col gap-2 border border-primary rounded p-2'>
        <div className='flex gap-2 mb-2'>
          <Input value={question} onChange={e => setQuestion(e.target.value)} disabled={loading} placeholder='Ask me anything from your documents...'/>
          <Button type='submit'>Search</Button>
        </div>
        <div className='flex items-center gap-2 cursor-pointer'>
          <Checkbox id='rerank' checked={rerank} onCheckedChange={setRerank}/>
          <Label htmlFor='rerank'>Rerank results?</Label>
        </div>
        {loading && <Loading/>}
      </div>
    </form>
  )
}

export default Search