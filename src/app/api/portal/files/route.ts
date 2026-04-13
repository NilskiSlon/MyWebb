import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const projectId = formData.get('project_id') as string

  if (!file || !projectId) {
    return NextResponse.json({ error: 'Missing file or project_id' }, { status: 400 })
  }

  // Verify this project belongs to the user
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('client_id', user.id)
    .single()

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 403 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const storagePath = `${user.id}/${projectId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('client-files')
    .upload(storagePath, buffer, { contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  await supabaseAdmin.from('client_files').insert({
    project_id: projectId,
    uploaded_by: user.id,
    storage_path: storagePath,
    file_name: file.name,
  })

  return NextResponse.json({ success: true })
}
