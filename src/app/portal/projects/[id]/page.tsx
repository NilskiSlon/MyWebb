import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Project, Render, Payment } from '@/lib/types'
import PaymentButton from '@/components/portal/PaymentButton'

const statusColors: Record<string, string> = {
  ongoing: 'bg-amber-900/40 text-amber-400',
  completed: 'bg-green-900/40 text-green-400',
  paused: 'bg-zinc-800 text-zinc-500',
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('client_id', user.id)
    .single()

  if (!project) notFound()

  const [{ data: renders }, { data: latestPayment }] = await Promise.all([
    supabase.from('renders').select('*').eq('project_id', id).order('display_order'),
    supabase
      .from('payments')
      .select('*')
      .eq('project_id', id)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const allRenders = (renders as Render[]) ?? []
  const wipRenders = allRenders.filter((r) => r.is_wip)
  const finalRenders = allRenders.filter((r) => !r.is_wip)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const p = project as Project & { price_amount?: number; price_description?: string }
  const payment = latestPayment as Payment | null

  return (
    <div>
      <Link href="/portal/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm mb-6 inline-flex items-center gap-1 transition-colors">
        ← Back to projects
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8 mt-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">{p.title}</h1>
          {p.description && (
            <p className="text-zinc-400 text-sm mt-1">{p.description}</p>
          )}
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full capitalize shrink-0 ${statusColors[p.status]}`}>
          {p.status}
        </span>
      </div>

      {/* Payment section */}
      {p.price_amount && (
        <div className="mb-10 bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-zinc-50 font-medium">Payment</p>
            {p.price_description && (
              <p className="text-zinc-400 text-sm mt-0.5">{p.price_description}</p>
            )}
            <p className="text-amber-400 font-semibold mt-1">
              {new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 0 }).format(p.price_amount / 100)}
            </p>
          </div>
          {payment?.status === 'paid' ? (
            <span className="text-sm bg-green-900/40 text-green-400 px-4 py-2 rounded-full">
              ✓ Paid
            </span>
          ) : (
            <PaymentButton projectId={id} amount={p.price_amount} />
          )}
        </div>
      )}

      {/* WIP previews */}
      {wipRenders.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-amber-400 text-zinc-950 px-2 py-0.5 rounded font-semibold">
              WORK IN PROGRESS
            </span>
            <p className="text-zinc-500 text-sm">Latest previews — not final</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {wipRenders.map((r) => (
              <RenderCard key={r.id} render={r} cloudName={cloudName} />
            ))}
          </div>
        </section>
      )}

      {/* Final renders */}
      {finalRenders.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-zinc-50 mb-4">Renders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {finalRenders.map((r) => (
              <RenderCard key={r.id} render={r} cloudName={cloudName} />
            ))}
          </div>
        </section>
      )}

      {allRenders.length === 0 && (
        <div className="border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No renders uploaded yet.</p>
          <p className="text-zinc-600 text-sm mt-1">Check back soon for updates.</p>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-zinc-800 flex gap-4">
        <Link
          href="/portal/files"
          className="text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-full transition-colors"
        >
          Upload reference files
        </Link>
        <Link
          href="/portal/reviews/new"
          className="text-sm bg-amber-400 hover:bg-amber-300 text-zinc-950 px-4 py-2 rounded-full font-medium transition-colors"
        >
          Leave a review
        </Link>
      </div>
    </div>
  )
}

function RenderCard({ render, cloudName }: { render: Render; cloudName?: string }) {
  if (render.type === 'video') {
    return (
      <div className="bg-zinc-900 rounded-lg overflow-hidden aspect-video border border-zinc-800 flex items-center justify-center">
        <svg className="w-10 h-10 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    )
  }

  const src = cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/w_800,q_auto,f_auto/${render.cloudinary_public_id}`
    : null

  if (!src) return null

  return (
    <div className="relative bg-zinc-900 rounded-lg overflow-hidden aspect-video border border-zinc-800">
      <Image src={src} alt="" fill className="object-cover" sizes="400px" />
    </div>
  )
}
