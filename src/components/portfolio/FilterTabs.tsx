'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const categories = [
  { value: '', label: 'All' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'animation', label: 'Animation' },
  { value: 'unreal', label: 'Unreal Engine' },
]

function FilterTabsInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') ?? ''

  function handleFilter(value: string) {
    const params = new URLSearchParams()
    if (value) params.set('category', value)
    router.push(`/portfolio${value ? `?${params.toString()}` : ''}`, {
      scroll: false,
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c.value}
          onClick={() => handleFilter(c.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            active === c.value
              ? 'bg-amber-400 text-zinc-950'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

export default function FilterTabs() {
  return (
    <Suspense fallback={<div className="h-10" />}>
      <FilterTabsInner />
    </Suspense>
  )
}
