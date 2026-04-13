'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Project { id: string; title: string }
interface Render {
  id: string
  cloudinary_public_id: string
  type: string
  is_wip: boolean
  display_order: number
}

interface Props {
  projects: Project[]
  selectedProjectId?: string
  existingRenders: Render[]
}

export default function UploadForm({ projects, selectedProjectId, existingRenders }: Props) {
  const [projectId, setProjectId] = useState(selectedProjectId ?? '')
  const [uploading, setUploading] = useState(false)
  const [renders, setRenders] = useState<Render[]>(existingRenders)
  const [error, setError] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [assignStatus, setAssignStatus] = useState('')
  const [priceAmount, setPriceAmount] = useState('')
  const [priceDescription, setPriceDescription] = useState('')
  const [priceStatus, setPriceStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  async function handleAssign() {
    if (!projectId || !clientEmail) return
    setAssignStatus('Sending invite...')
    const res = await fetch('/api/admin/projects/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, email: clientEmail }),
    })
    if (res.ok) {
      setAssignStatus('✓ Invite sent & project assigned')
      setClientEmail('')
    } else {
      setAssignStatus('Failed — check the email and try again')
    }
  }

  async function handleSavePrice() {
    if (!projectId || !priceAmount) return
    setPriceStatus('Saving...')
    const res = await fetch('/api/admin/projects/price', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: projectId,
        price_amount: Math.round(parseFloat(priceAmount) * 100),
        price_description: priceDescription || null,
      }),
    })
    setPriceStatus(res.ok ? '✓ Price saved' : 'Failed — try again')
  }

  async function handleUpload() {
    if (!projectId || !fileInputRef.current?.files?.length) return
    setUploading(true)
    setError('')

    const files = Array.from(fileInputRef.current.files)

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('project_id', projectId)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        setError('Upload failed for ' + file.name)
        continue
      }

      const render = await res.json()
      setRenders((prev) => [...prev, render])
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function toggleWip(renderId: string, current: boolean) {
    await fetch('/api/admin/renders/wip', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: renderId, is_wip: !current }),
    })
    setRenders((prev) =>
      prev.map((r) => (r.id === renderId ? { ...r, is_wip: !current } : r))
    )
  }

  async function setCover(cloudinaryId: string) {
    await fetch('/api/admin/projects/cover', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, cover_cloudinary_id: cloudinaryId }),
    })
    router.refresh()
  }

  async function deleteRender(renderId: string) {
    await fetch('/api/admin/renders/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: renderId }),
    })
    setRenders((prev) => prev.filter((r) => r.id !== renderId))
  }

  return (
    <div className="space-y-8">
      {/* Project selector */}
      <div className="max-w-sm">
        <label className="block text-sm text-zinc-400 mb-2">Select project</label>
        <select
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value)
            router.push(`/admin/uploads?project=${e.target.value}`)
          }}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="">Choose a project...</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      {projectId && (
        <>
          {/* Assign to client */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm text-zinc-300 font-medium mb-3">Assign to client</p>
            <p className="text-xs text-zinc-500 mb-3">Enter the client's email — they'll receive an invite to the portal.</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@email.com"
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-50 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                onClick={handleAssign}
                disabled={!clientEmail}
                className="px-4 py-2 bg-amber-400 text-zinc-950 rounded-lg text-sm font-medium hover:bg-amber-300 transition-colors disabled:opacity-40"
              >
                Invite
              </button>
            </div>
            {assignStatus && (
              <p className="text-xs mt-2 text-zinc-400">{assignStatus}</p>
            )}
          </div>

          {/* Set price */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm text-zinc-300 font-medium mb-3">Set price</p>
            <p className="text-xs text-zinc-500 mb-3">Client will see a Pay button on their project page.</p>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                placeholder="Amount in SEK (e.g. 15000)"
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-50 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                onClick={handleSavePrice}
                disabled={!priceAmount}
                className="px-4 py-2 bg-amber-400 text-zinc-950 rounded-lg text-sm font-medium hover:bg-amber-300 transition-colors disabled:opacity-40"
              >
                Save
              </button>
            </div>
            <input
              type="text"
              value={priceDescription}
              onChange={(e) => setPriceDescription(e.target.value)}
              placeholder="Description (optional, e.g. Final delivery package)"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-50 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {priceStatus && <p className="text-xs mt-2 text-zinc-400">{priceStatus}</p>}
          </div>

          {/* Upload area */}
          <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-zinc-600 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block mb-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-zinc-300 text-sm">
                Click to select images or videos
              </p>
              <p className="text-zinc-600 text-xs mt-1">PNG, JPG, MP4, MOV supported</p>
            </label>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-2 px-6 py-2 bg-amber-400 text-zinc-950 rounded-full text-sm font-semibold hover:bg-amber-300 transition-colors disabled:opacity-60"
            >
              {uploading ? 'Uploading...' : 'Upload selected files'}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          {/* Existing renders */}
          {renders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-50 mb-4">
                Renders ({renders.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {renders.map((r) => (
                  <div key={r.id} className="group relative bg-zinc-900 rounded-lg overflow-hidden aspect-video border border-zinc-800">
                    {r.type === 'image' && cloudName ? (
                      <Image
                        src={`https://res.cloudinary.com/${cloudName}/image/upload/w_400,q_auto,f_auto/${r.cloudinary_public_id}`}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}

                    {r.is_wip && (
                      <span className="absolute top-1.5 left-1.5 text-xs bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded font-medium">
                        WIP
                      </span>
                    )}

                    <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => toggleWip(r.id, r.is_wip)}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-full w-full transition-colors"
                      >
                        {r.is_wip ? 'Remove WIP' : 'Mark as WIP'}
                      </button>
                      <button
                        onClick={() => setCover(r.cloudinary_public_id)}
                        className="text-xs bg-amber-400 hover:bg-amber-300 text-zinc-950 px-3 py-1.5 rounded-full w-full transition-colors font-medium"
                      >
                        Set as cover
                      </button>
                      <button
                        onClick={() => deleteRender(r.id)}
                        className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 px-3 py-1.5 rounded-full w-full transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
