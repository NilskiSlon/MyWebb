import Stripe from 'stripe'

let _client: Stripe | undefined

export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string) {
    if (!_client) {
      _client = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
        apiVersion: '2026-03-25.dahlia',
      })
    }
    return _client[prop as keyof Stripe]
  },
})
