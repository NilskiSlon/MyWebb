import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function AdminDashboard() {
  const [{ count: projectCount }, { count: quoteCount }] = await Promise.all([
    supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const { data: recentProjects } = await supabaseAdmin
    .from('projects')
    .select('id, title, category, status, is_public, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-50 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Projects', value: projectCount ?? 0 },
          { label: 'New Quote Requests', value: quoteCount ?? 0 },
          { label: 'Status', value: '✓ Live' },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-zinc-500 text-sm mb-1">{s.label}</p>
            <p className="text-zinc-50 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <h2 className="text-lg font-semibold text-zinc-50 mb-4">Recent Projects</h2>
      {recentProjects && recentProjects.length > 0 ? (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Public</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p, i) => (
                <tr
                  key={p.id}
                  className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}
                >
                  <td className="px-4 py-3 text-zinc-200">{p.title}</td>
                  <td className="px-4 py-3 text-zinc-400 capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-zinc-400 capitalize">{p.status}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_public ? 'bg-green-900/50 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {p.is_public ? 'Public' : 'Private'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-500 text-sm">No projects yet. <a href="/admin/projects/new" className="text-amber-400 hover:underline">Create your first project →</a></p>
      )}
    </div>
  )
}
