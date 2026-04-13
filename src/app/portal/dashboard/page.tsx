import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Project } from '@/lib/types'

const statusColors: Record<string, string> = {
  ongoing: 'bg-amber-900/40 text-amber-400',
  completed: 'bg-green-900/40 text-green-400',
  paused: 'bg-zinc-800 text-zinc-500',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const clientProjects = (projects as Project[]) ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-50 mb-2">My Projects</h1>
      <p className="text-zinc-500 text-sm mb-8">Track your ongoing and completed projects.</p>

      {clientProjects.length === 0 ? (
        <div className="border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No projects assigned yet.</p>
          <p className="text-zinc-600 text-sm mt-1">
            Contact the studio if you're expecting to see a project here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientProjects.map((project) => (
            <Link
              key={project.id}
              href={`/portal/projects/${project.id}`}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-colors block"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-zinc-50 font-semibold">{project.title}</h2>
                <span className={`text-xs px-2 py-1 rounded-full capitalize shrink-0 ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              {project.description && (
                <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{project.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span className="capitalize">{project.category}</span>
                <span>
                  {new Date(project.created_at).toLocaleDateString('sv-SE')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
