import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(req: NextRequest) {
  const { project_id, price_amount, price_description } = await req.json()

  if (!project_id) {
    return NextResponse.json({ error: 'Missing project_id' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('projects')
    .update({ price_amount, price_description })
    .eq('id', project_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
