import Image from 'next/image'
import type { Project } from '@/lib/types'

const categoryLabels: Record<string, string> = {
  kitchen: 'Kitchen',
  exterior: 'Exterior',
  animation: 'Animation',
  unreal: 'Unreal Engine',
}

function ProjectCard({ project }: { project: Project }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const imageUrl = project.cover_cloudinary_id && cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/w_800,q_auto,f_auto/${project.cover_cloudinary_id}`
    : null

  return (
    <div className="group relative overflow-hidden rounded-lg bg-zinc-900 aspect-video cursor-pointer">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <span className="text-zinc-600 text-sm">No preview</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-xs text-amber-400 uppercase tracking-wider">
          {categoryLabels[project.category]}
        </span>
        <h3 className="text-zinc-50 font-medium mt-1">{project.title}</h3>
      </div>
    </div>
  )
}

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
        <p className="text-zinc-500 text-lg">Projects coming soon.</p>
        <p className="text-zinc-600 text-sm mt-2">Check back to see the latest work.</p>
      </div>
    )
  }

  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </>
  )
}
