import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/projects/new', label: 'New Project' },
  { href: '/admin/uploads', label: 'Upload Renders' },
  { href: '/admin/quotes', label: 'Quote Requests' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [cookieStore, headersList] = await Promise.all([cookies(), headers()])
  const auth = cookieStore.get('admin_auth')
  const pathname = headersList.get('x-pathname') ?? ''

  if (!pathname.startsWith('/admin/login') && auth?.value !== process.env.ADMIN_SECRET) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-56 border-r border-zinc-800 flex flex-col py-8 px-4 gap-1 shrink-0">
        <Link
          href="/"
          className="text-zinc-50 font-semibold tracking-widest text-sm uppercase mb-8 px-3"
        >
          ShizViz
        </Link>
        {adminLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors"
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-auto">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full text-left text-sm text-zinc-600 hover:text-zinc-400 px-3 py-2 rounded-lg transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
