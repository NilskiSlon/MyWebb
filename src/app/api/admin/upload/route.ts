import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const projectId = formData.get('project_id') as string

  if (!file || !projectId) {
    return NextResponse.json({ error: 'Missing file or project_id' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const isVideo = file.type.startsWith('video/')

  const uploaded = await new Promise<{ public_id: string; resource_type: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `shiz-viz/projects/${projectId}`,
          resource_type: isVideo ? 'video' : 'image',
        },
        (err, result) => {
          if (err || !result) return reject(err)
          resolve(result)
        }
      )
      stream.end(buffer)
    }
  )

  const { data: render, error } = await supabaseAdmin
    .from('renders')
    .insert({
      project_id: projectId,
      cloudinary_public_id: uploaded.public_id,
      type: isVideo ? 'video' : 'image',
      is_wip: false,
      display_order: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(render)
}
