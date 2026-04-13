'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const categories = ['kitchen', 'exterior', 'animation', 'unreal']

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
      is_public: (form.elements.namedItem('is_public') as HTMLInputElement).checked,
    }

    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const { id } = await res.json()
      router.push(`/admin/uploads?project=${id}`)
    } else {
      setError('Failed to create project. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-zinc-50 mb-8">New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Title</label>
          <input
            name="title"
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
            placeholder="e.g. Modern Kitchen – Stockholm"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Description</label>
          <textarea
            name="description"
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
            placeholder="Short description shown on the portfolio page"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-amber-400 transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Status</label>
            <select
              name="status"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            name="is_public"
            type="checkbox"
            className="w-4 h-4 accent-amber-400"
          />
          <span className="text-sm text-zinc-300">Make public (visible on portfolio)</span>
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create project & add renders →'}
        </button>
      </form>
    </div>
  )
}
