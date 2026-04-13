export type Category = 'kitchen' | 'exterior' | 'animation' | 'unreal'
export type RenderType = 'image' | 'video'
export type QuoteStatus = 'new' | 'reviewed' | 'quoted' | 'accepted' | 'declined'
export type ProjectStatus = 'ongoing' | 'completed' | 'paused'

export interface Project {
  id: string
  title: string
  description: string | null
  category: Category
  is_public: boolean
  cover_cloudinary_id: string | null
  cover_type: RenderType
  client_id: string | null
  status: ProjectStatus
  created_at: string
}

export interface Render {
  id: string
  project_id: string
  cloudinary_public_id: string
  type: RenderType
  is_wip: boolean
  display_order: number
  created_at: string
}

export interface Review {
  id: string
  client_name: string
  rating: number
  body: string
  approved: boolean
  created_at: string
}

export interface Quote {
  id: string
  name: string
  email: string
  project_type: string
  description: string
  budget: string | null
  status: QuoteStatus
  created_at: string
}

export interface ClientFile {
  id: string
  project_id: string
  uploaded_by: string
  storage_path: string
  file_name: string
  created_at: string
}

export interface Payment {
  id: string
  client_id: string
  project_id: string
  stripe_payment_id: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
  created_at: string
}
