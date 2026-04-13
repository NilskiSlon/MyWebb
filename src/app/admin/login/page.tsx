'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-zinc-50 font-semibold tracking-widest text-sm uppercase mb-8 text-center">
          ShizViz Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {error && (
            <p className="text-red-400 text-sm">Incorrect password.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
