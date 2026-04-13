import Link from 'next/link'
import SignOutButton from '@/components/portal/SignOutButton'
import { createClient } from '@/lib/supabase-server'

const navLinks = [
  { href: '/portal/dashboard', label: 'My Projects' },
  { href: '/portal/files', label: 'Upload Files' },
  { href: '/portal/reviews/new', label: 'Leave a Review' },
]

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-56 border-r border-zinc-800 flex flex-col py-8 px-4 gap-1 shrink-0">
        <Link
          href="/"
          className="text-zinc-50 font-semibold tracking-widest text-sm uppercase mb-2 px-3"
        >
          ShizViz
        </Link>
        <p className="text-zinc-600 text-xs px-3 mb-6 truncate">{user?.email}</p>

        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors"
          >
            {l.label}
          </Link>
        ))}

        <div className="mt-auto">
          <SignOutButton />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
