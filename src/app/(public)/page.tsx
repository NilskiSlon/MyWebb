import Link from 'next/link'
import SplineHero from '@/components/portfolio/SplineHero'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'

async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(3)
  return (data as Project[]) ?? []
}

export default async function HomePage() {
  const featured = await getFeaturedProjects()

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <SplineHero sceneUrl={process.env.NEXT_PUBLIC_SPLINE_SCENE_URL} />
        <div className="relative z-10 text-center px-6">
          <p className="text-amber-400 text-sm tracking-widest uppercase mb-4">
            3D Design Studio
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-50 tracking-tight mb-6">
            ShizViz
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Architectural visualization, 3D animation, and real-time Unreal Engine environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/portfolio"
              className="px-8 py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors"
            >
              View Work
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-zinc-600 text-zinc-200 rounded-full font-medium hover:border-zinc-400 hover:text-zinc-50 transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <p className="text-amber-400 text-sm tracking-widest uppercase mb-3">What I do</p>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-12">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Architectural Visualization',
                desc: 'Photorealistic renders of interiors and exteriors — kitchens, living spaces, facades, and full developments.',
                tag: 'Blender',
              },
              {
                title: '3D Animation',
                desc: 'Cinematic walkthroughs and product animations that bring your project to life before it\'s built.',
                tag: 'Blender',
              },
              {
                title: 'Real-time Environments',
                desc: 'Interactive real-time scenes and architectural walkthroughs built in Unreal Engine 5.',
                tag: 'Unreal Engine 5',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <span className="text-xs text-amber-400 uppercase tracking-wider">{s.tag}</span>
                <h3 className="text-zinc-50 font-semibold text-lg mt-2 mb-3">{s.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      {featured.length > 0 && (
        <section className="py-24 px-6 border-t border-zinc-800">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-amber-400 text-sm tracking-widest uppercase mb-3">Portfolio</p>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">Featured Work</h2>
              </div>
              <Link
                href="/portfolio"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PortfolioGrid projects={featured} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
            Ready to start a project?
          </h2>
          <p className="text-zinc-400 mb-8">
            Tell me about your vision and I'll get back to you with a quote.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
