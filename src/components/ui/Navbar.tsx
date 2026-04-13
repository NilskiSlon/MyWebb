'use client'
import { useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '/portfolio', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-zinc-50 font-semibold tracking-widest text-sm uppercase"
        >
          ShizViz
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/portal"
            className="text-sm bg-amber-400 text-zinc-950 px-4 py-2 rounded-full font-medium hover:bg-amber-300 transition-colors"
          >
            Client Portal
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-zinc-50"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-zinc-300 hover:text-zinc-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/portal"
            className="text-sm bg-amber-400 text-zinc-950 px-4 py-2 rounded-full font-medium text-center"
            onClick={() => setOpen(false)}
          >
            Client Portal
          </Link>
        </div>
      )}
    </nav>
  )
}
