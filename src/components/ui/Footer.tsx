import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-zinc-50 font-semibold tracking-widest text-sm uppercase">
            ShizViz
          </span>
          <p className="text-zinc-500 text-sm mt-1">3D Architectural Visualization</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
          <Link href="/portfolio" className="hover:text-zinc-50 transition-colors">Work</Link>
          <Link href="/about" className="hover:text-zinc-50 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-zinc-50 transition-colors">Contact</Link>
          <Link href="/portal" className="hover:text-zinc-50 transition-colors">Client Portal</Link>
        </nav>
        <p className="text-zinc-600 text-sm">
          © {new Date().getFullYear()} ShizViz. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
