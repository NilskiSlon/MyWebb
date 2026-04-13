import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(req: NextRequest) {
  const { project_id, cover_cloudinary_id } = await req.json()

  const { error } = await supabaseAdmin
    .from('projects')
    .update({ cover_cloudinary_id })
    .eq('id', project_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
