'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'

const projectTypes = [
  'Architectural Visualization',
  'Interior Renders',
  'Exterior Renders',
  '3D Animation',
  'Unreal Engine Environment',
  'Other',
]

const budgets = [
  'Under 5 000 kr',
  '5 000 – 15 000 kr',
  '15 000 – 30 000 kr',
  '30 000 – 60 000 kr',
  '60 000+ kr',
  'Not sure yet',
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      project_type: (form.elements.namedItem('project_type') as HTMLSelectElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      budget: (form.elements.namedItem('budget') as HTMLSelectElement).value,
    }

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-amber-400 text-sm tracking-widest uppercase mb-3">Contact</p>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">Start a project</h1>
        <p className="text-zinc-400 mb-12">
          Tell me about your project and I'll get back to you within 24 hours with a quote.
        </p>

        {status === 'success' ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-zinc-50 font-semibold text-xl mb-2">Message sent!</h2>
            <p className="text-zinc-400 text-sm">I'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2" htmlFor="project_type">
                Project type
              </label>
              <select
                id="project_type"
                name="project_type"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="">Select a type...</option>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2" htmlFor="description">
                Project description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                placeholder="Tell me about your project — what do you need, do you have references, any deadlines?"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2" htmlFor="budget">
                Budget range
              </label>
              <select
                id="budget"
                name="budget"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="">Select a range (optional)</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">
                Something went wrong. Please try again or email me directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
