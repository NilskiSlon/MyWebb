import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cloudinary } from '@/lib/cloudinary'

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  const { data: render } = await supabaseAdmin
    .from('renders')
    .select('cloudinary_public_id, type')
    .eq('id', id)
    .single()

  if (render) {
    await cloudinary.uploader.destroy(render.cloudinary_public_id, {
      resource_type: render.type === 'video' ? 'video' : 'image',
    })
  }

  const { error } = await supabaseAdmin.from('renders').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
