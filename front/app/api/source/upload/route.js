import { glog } from '@/app/api/log'
import * as fs from 'fs'
import path from 'path'

export async function POST(req) {
  let log = glog.child({ mod: 'source.upload' })

  let formData = undefined
  try {
    formData = await req.formData()
  } catch(error) {
    log.error({ msg: `invalid request data: ${error.message}` })
    return Response.json({
      error: {
        code: 'badrequest.parser',
        message: error.message
      }
    }, { status: 500 })
  }

  try {
    const id = formData.get('id')
    const sid = formData.get('sid')
    const name = formData.get('name')
    const file = formData.get('file')
    if(!id || !sid || !name || !file) {
      glog.info({ msg: `file required`, id, sid, name, file: file?.name })
      return Response.json({
        error: {
          code: 'badrequest',
          message: 'fields missing from the request'
        }
      }, { status: 400 })
    }

    log = glog.child({ mod: 'kb.source.upload', sid, name })

    if(file.type !== 'application/pdf') {
      log.error({ msg: `file format is not PDF; expected application/pdf but received: ${file.type} instead` })
      return Response.json({
        error: {
          code: 'file.type.invalid',
          message: 'invalid file format'
        }
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadDir = path.join(process.cwd(), '..', 'data')
    if(!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const fileName = `${id}.pdf`
    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, buffer)

    const cmd = {
      id,
      sid,
      source: {
        id,
        name,
        path: filePath
      }
    }
    const url = `${process.env.BACK_SERVICE}/kb/add`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cmd)
    })

    const data = await res.json()
    if(!res.ok) {
      log.error({ msg: `received error`, url, data })
      return Response.json(data, { status: 500 })
    }

    log.info({ msg: `received data`, url })
    return Response.json(data, { status: 200 })
  }
  catch(error) {
    glog.error({ msg: `service error`, error: error.message })
    return Response.json({
      error: {
        code: 'service',
        message: error.message
      }
    }, { status: 500 })
  }
}