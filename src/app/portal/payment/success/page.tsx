import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-50 mb-3">Payment successful</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Thank you — your payment has been received. You'll get a confirmation email shortly.
        </p>
        <Link
          href="/portal/dashboard"
          className="inline-block px-6 py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors"
        >
          Back to my projects
        </Link>
      </div>
    </div>
  )
}
