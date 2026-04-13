import { supabaseAdmin } from '@/lib/supabase-admin'

const statusColors: Record<string, string> = {
  new: 'bg-amber-900/40 text-amber-400',
  reviewed: 'bg-blue-900/40 text-blue-400',
  quoted: 'bg-purple-900/40 text-purple-400',
  accepted: 'bg-green-900/40 text-green-400',
  declined: 'bg-zinc-800 text-zinc-500',
}

export default async function QuotesPage() {
  const { data: quotes } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-50 mb-8">Quote Requests</h1>

      {!quotes || quotes.length === 0 ? (
        <p className="text-zinc-500 text-sm">No quote requests yet.</p>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-zinc-50 font-medium">{q.name}</p>
                  <a href={`mailto:${q.email}`} className="text-amber-400 text-sm hover:underline">
                    {q.email}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[q.status]}`}>
                    {q.status}
                  </span>
                  <StatusUpdater id={q.id} current={q.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-zinc-500">Type: </span>
                  <span className="text-zinc-300">{q.project_type}</span>
                </div>
                {q.budget && (
                  <div>
                    <span className="text-zinc-500">Budget: </span>
                    <span className="text-zinc-300">{q.budget}</span>
                  </div>
                )}
              </div>
              <p className="text-zinc-400 text-sm whitespace-pre-wrap">{q.description}</p>
              <p className="text-zinc-600 text-xs mt-3">
                {new Date(q.created_at).toLocaleDateString('sv-SE', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusUpdater({ id, current }: { id: string; current: string }) {
  const statuses = ['new', 'reviewed', 'quoted', 'accepted', 'declined']
  return (
    <form action="/api/admin/quotes/status" method="POST" className="flex items-center gap-1">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={current}
        className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1 focus:outline-none"
        onChange={(e) => (e.target.form as HTMLFormElement).requestSubmit()}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </form>
  )
}
