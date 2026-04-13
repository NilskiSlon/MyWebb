'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface Project { id: string; title: string }

export default function FilesPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState<string[]>([])
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProjects() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('projects')
        .select('id, title')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
      setProjects((data as Project[]) ?? [])
    }
    fetchProjects()
  }, [supabase])

  async function handleUpload() {
    if (!projectId || !fileInputRef.current?.files?.length) return
    setUploading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const files = Array.from(fileInputRef.current.files)

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('project_id', projectId)

      const res = await fetch('/api/portal/files', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setUploaded((prev) => [...prev, file.name])
      } else {
        setError(`Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-zinc-50 mb-2">Upload Files</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Upload reference files, floor plans, or inspiration images for your project.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Select project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="">Choose a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {projectId && (
          <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-zinc-600 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              id="client-file-upload"
            />
            <label htmlFor="client-file-upload" className="cursor-pointer block mb-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-zinc-300 text-sm">Click to select files</p>
              <p className="text-zinc-600 text-xs mt-1">Any file type accepted</p>
            </label>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2 bg-amber-400 text-zinc-950 rounded-full text-sm font-semibold hover:bg-amber-300 transition-colors disabled:opacity-60"
            >
              {uploading ? 'Uploading...' : 'Upload files'}
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {uploaded.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-sm font-medium mb-2">Uploaded this session:</p>
            <ul className="space-y-1">
              {uploaded.map((name) => (
                <li key={name} className="text-zinc-300 text-sm flex items-center gap-2">
                  <span className="text-green-400">✓</span> {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
