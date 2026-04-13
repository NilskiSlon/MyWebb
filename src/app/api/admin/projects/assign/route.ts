import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { project_id, email } = await req.json()

  if (!project_id || !email) {
    return NextResponse.json({ error: 'Missing project_id or email' }, { status: 400 })
  }

  // Invite the user — creates account + sends invite email if they don't exist
  const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: { invited_by: 'shiz-viz-studio' },
    }
  )

  if (inviteError) {
    // User might already exist — look them up
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const existing = users.find((u) => u.email === email)
    if (!existing) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 })
    }

    await supabaseAdmin.from('projects').update({ client_id: existing.id }).eq('id', project_id)
    return NextResponse.json({ success: true, user_id: existing.id })
  }

  await supabaseAdmin
    .from('projects')
    .update({ client_id: inviteData.user.id })
    .eq('id', project_id)

  return NextResponse.json({ success: true, user_id: inviteData.user.id })
}
