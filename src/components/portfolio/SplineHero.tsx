'use client'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <GradientBackground />,
})

function GradientBackground() {
  return (
    <div className="absolute inset-0 bg-zinc-950">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,158,11,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

export default function SplineHero({ sceneUrl }: { sceneUrl?: string }) {
  if (!sceneUrl) return <GradientBackground />
  return (
    <div className="absolute inset-0">
      <Spline scene={sceneUrl} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
