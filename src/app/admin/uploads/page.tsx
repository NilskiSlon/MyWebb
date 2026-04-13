import { supabaseAdmin } from '@/lib/supabase-admin'
import UploadForm from '@/components/admin/UploadForm'

export default async function UploadsPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>
}) {
  const { project: selectedProjectId } = await searchParams

  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('id, title')
    .order('created_at', { ascending: false })

  const { data: renders } = selectedProjectId
    ? await supabaseAdmin
        .from('renders')
        .select('*')
        .eq('project_id', selectedProjectId)
        .order('display_order')
    : { data: [] }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-50 mb-8">Upload Renders</h1>
      <UploadForm
        projects={projects ?? []}
        selectedProjectId={selectedProjectId}
        existingRenders={renders ?? []}
      />
    </div>
  )
}
