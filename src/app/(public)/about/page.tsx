import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 px-6 border-b border-zinc-800">
        <div className="mx-auto max-w-4xl">
          <p className="text-amber-400 text-sm tracking-widest uppercase mb-4">About</p>
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 mb-8 leading-tight">
            Turning ideas into<br />visual reality
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            I'm a 3D designer specializing in architectural visualization and real-time environments.
            Working with Blender and Unreal Engine 5, I help architects, developers, and studios
            communicate their vision with photorealistic renders, animations, and interactive walkthroughs.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-24 px-6 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-zinc-50 mb-12">What I offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Interior & Exterior Visualization',
                items: [
                  'Kitchen & bathroom renders',
                  'Living spaces & bedrooms',
                  'Building facades',
                  'Landscape & site renders',
                ],
              },
              {
                title: 'Animation & Motion',
                items: [
                  'Cinematic walkthroughs',
                  'Product animations',
                  'Architectural flyovers',
                  'Camera path animations',
                ],
              },
              {
                title: 'Unreal Engine 5',
                items: [
                  'Real-time walkthroughs',
                  'Interactive environments',
                  'VR-ready scenes',
                  'Lumen global illumination',
                ],
              },
              {
                title: 'Workflow & Pipeline',
                items: [
                  'CAD & blueprint to 3D',
                  'Direct Blender pipeline',
                  'Post-processing & grading',
                  'Multiple revision rounds',
                ],
              },
            ].map((s) => (
              <div key={s.title} className="border border-zinc-800 rounded-xl p-6">
                <h3 className="text-zinc-50 font-semibold text-lg mb-4">{s.title}</h3>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="text-zinc-400 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-24 px-6 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-zinc-50 mb-8">Tools & Software</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Blender',
              'Unreal Engine 5',
              'Adobe Photoshop',
              'DaVinci Resolve',
              'Substance Painter',
            ].map((tool) => (
              <span
                key={tool}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full text-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-50 mb-4">Let's work together</h2>
          <p className="text-zinc-400 mb-8">Have a project in mind? I'd love to hear about it.</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-amber-400 text-zinc-950 rounded-full font-semibold hover:bg-amber-300 transition-colors"
          >
            Start a project
          </Link>
        </div>
      </section>
    </div>
  )
}
