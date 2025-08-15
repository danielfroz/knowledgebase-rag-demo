'use client'

import { Button } from "@/components/ui/button"
import { useAlert, useApi } from "@/hooks"
import { useEffect, useState } from "react"
import { v4 } from "uuid"

const Sources = () => {
  const api = useApi()
  const alert = useAlert()
  const [ sources, setSources ] = useState(undefined)
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    load()
    const interval = setInterval(load, 5 * 1000)
    return () => clearInterval(interval)
  }, [])

  function load() {
    setLoading(true)
    const id = v4()
    const query = {
      id,
      sid: id
    }
    api.post('/api/kb/list', query)
      .then(res => {
        setLoading(false)
        setSources(res.sources)
      })
      .catch(error => {
        setLoading(false)
        alert.error(error)
      })
  }

  return (
    <div className='border border-primary rounded mb-2 p-2'>
      <div className='bg-slate-100 rounded p-2'>
        Knowledge Base Data Sources
      </div>
      <div className='grid grid-cols-4 gap-2 p-2'>
        {sources && sources.map(s =>
          <Source key={s.id} source={s} reload={load}/>
        )}
      </div>
      <div className='bg-slate-100 rounded p-2'>
        <Button onClick={() => load()} disabled={loading}>Refresh</Button>
      </div>
    </div>
  )
}

export default Sources

const Source = ({ source, reload }) => {
  const api = useApi()
  const alert = useAlert()
  const isProcessed = source.chunks && source.chunks.processed === source.chunks.total ? true: false
  const [ loading, setLoading ] = useState(false)

  function del() {
    setLoading(true)
    const id = v4()
    const cmd = {
      id,
      sid: id,
      source: source.id
    }
    api.post('/api/kb/delete', cmd)
      .then(res => {
        setLoading(false)
        alert.info('Source deleted')
        reload()
      })
      .catch(error => {
        setLoading(false)
        alert.error(error)
      })
  }

  return (
    <div className='border border-primary rounded p-2'>
      <div>{source.name}</div>
      <div className='text-xs'>{source.created}</div>
      <div>
        <div>{isProcessed ? 'Available': 'Processing...'}</div>
        {source.chunks &&
          <div className='text-xs'>{source.chunks.processed} / {source.chunks.total}</div>
        }
      </div>
      <div>
        <Button onClick={() => del()} disabled={loading}>Delete</Button>
      </div>
    </div>
  )
}