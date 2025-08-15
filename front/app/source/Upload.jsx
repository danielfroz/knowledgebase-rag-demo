'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAlert, useApi } from "@/hooks"
import { useState } from "react"
import { v4 } from "uuid"

const Upload = ({ dismiss }) => {
  const api = useApi()
  const alert = useAlert()
  const [ file, setFile ] = useState(undefined)
  const [ name, setName ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ errors, setErrors ] = useState({})

  function save() {
    const errors = {}
    setErrors(errors)
    if(name === '') {
      errors.name = 'This field is required'
    }
    if(!file) {
      errors.file = 'You must pick the PDF file to upload'
    }
    if(Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    setLoading(true)
    const id = v4()
    const form = new FormData()
    form.append('id', id)
    form.append('sid', id)
    form.append('name', name)
    form.append('file', file)

    api.post('/api/kb/upload', form)
      .then(res => {
        alert.info('Service is processing this new file')
        setLoading(false)
        dismiss()
      })
      .catch(error => {
        setLoading(false)
        alert.error(error)
      })
  }

  return (
    <form onSubmit={e => {
      e.preventDefault()
      save()
    }}>
      <div className='border border-primary rounded p-2 mb-2'>
        <div className='grid grid-cols-2 gap-2 mb-2'>
          <div>
            <label className='text-sm'>Name</label>
            <Input value={name} onChange={e => setName(e.target.value)}/>
            {errors && errors.name &&
              <div className='text-red-600 text-xs'>{errors.name}</div>
            }
          </div>
          <div>
            <label className='text-sm'>Choose your file here. We only accept PDF files for now...</label>
            <Input type='file' accept="application/pdf" onChange={e => setFile(e.target.files[0])}/>
            {errors && errors.file &&
              <div className='text-red-600 text-xs'>
                {errors.file}
              </div>
            }
          </div>
        </div>
        <div className='flex gap-2 bg-gray-100 rounded p-2'>
          <Button type='submit' disabled={loading}>Save</Button>
          <Button type='button' onClick={() => dismiss()}>Cancel</Button>
        </div>
      </div>
    </form>
  )
}

export default Upload