import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Project, Category } from '@/lib/types'
import FilterTabs from '@/components/portfolio/FilterTabs'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'

export const metadata: Metadata = { title: 'Work' }

const validCategories: Category[] = ['kitchen', 'exterior', 'animation', 'unreal']

async function getProjects(category?: Category): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)

  const { data } = await query
  return (data as Project[]) ?? []
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = validCategories.includes(category as Category)
    ? (category as Category)
    : undefined

  const projects = await getProjects(activeCategory)

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-amber-400 text-sm tracking-widest uppercase mb-3">Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-8">Work</h1>
          <FilterTabs />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PortfolioGrid projects={projects} />
        </div>
      </div>
    </div>
  )
}
