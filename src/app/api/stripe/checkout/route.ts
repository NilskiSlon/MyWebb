import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { project_id } = await req.json()

  const { data: project } = await supabase
    .from('projects')
    .select('id, title, price_amount, price_description')
    .eq('id', project_id)
    .eq('client_id', user.id)
    .single()

  if (!project || !project.price_amount) {
    return NextResponse.json({ error: 'Project not found or no price set' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'sek',
          product_data: {
            name: project.title,
            description: project.price_description ?? undefined,
          },
          unit_amount: project.price_amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: user.email ?? undefined,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/projects/${project_id}`,
    metadata: { project_id, user_id: user.id },
  })

  await supabaseAdmin.from('payments').insert({
    client_id: user.id,
    project_id,
    stripe_payment_id: session.id,
    amount: project.price_amount,
    currency: 'sek',
    status: 'pending',
  })

  return NextResponse.json({ url: session.url })
}
