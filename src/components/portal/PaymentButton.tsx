'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  projectId: string
  amount: number
}

export default function PaymentButton({ projectId, amount }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formatted = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
  }).format(amount / 100)

  async function handlePay() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId }),
    })
    const { url } = await res.json()
    if (url) {
      router.push(url)
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="px-6 py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors disabled:opacity-60"
    >
      {loading ? 'Redirecting to payment...' : `Pay ${formatted}`}
    </button>
  )
}
