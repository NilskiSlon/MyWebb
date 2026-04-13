import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const id = formData.get('id') as string
  const status = formData.get('status') as string

  const { error } = await supabaseAdmin
    .from('quotes')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.redirect(new URL('/admin/quotes', process.env.NEXT_PUBLIC_APP_URL!))
}
