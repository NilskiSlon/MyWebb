'use client'
import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function NewReviewPage() {
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('reviews').insert({
      client_id: user?.id,
      client_name: (form.elements.namedItem('name') as HTMLInputElement).value,
      rating,
      body: (form.elements.namedItem('body') as HTMLTextAreaElement).value,
      approved: false,
    })

    if (error) {
      setError('Failed to submit review. Try again.')
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="max-w-xl">
        <div className="border border-zinc-800 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-zinc-50 font-semibold text-xl mb-2">Thank you!</h2>
          <p className="text-zinc-400 text-sm">Your review will appear on the site once approved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-zinc-50 mb-2">Leave a Review</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Your feedback will appear on the portfolio after approval.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Your name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
            placeholder="Name shown publicly"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-3">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-zinc-700'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Review</label>
          <textarea
            name="body"
            required
            rows={5}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
            placeholder="Tell us about your experience working together..."
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit review'}
        </button>
      </form>
    </div>
  )
}
