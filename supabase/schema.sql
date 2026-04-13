-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text not null check (category in ('kitchen', 'exterior', 'animation', 'unreal')),
  is_public boolean default false,
  cover_cloudinary_id text,
  cover_type text default 'image' check (cover_type in ('image', 'video')),
  client_id uuid references auth.users(id) on delete set null,
  status text default 'ongoing' check (status in ('ongoing', 'completed', 'paused')),
  created_at timestamptz default now()
);

-- Renders
create table public.renders (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  cloudinary_public_id text not null,
  type text default 'image' check (type in ('image', 'video')),
  is_wip boolean default false,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- Reviews
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references auth.users(id) on delete set null,
  client_name text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Quotes / contact requests
create table public.quotes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  project_type text not null,
  description text not null,
  budget text,
  status text default 'new' check (status in ('new', 'reviewed', 'quoted', 'accepted', 'declined')),
  created_at timestamptz default now()
);

-- Client uploaded files
create table public.client_files (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  storage_path text not null,
  file_name text not null,
  created_at timestamptz default now()
);

-- Payments
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references auth.users(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  stripe_payment_id text,
  amount integer not null, -- in smallest currency unit (öre)
  currency text default 'sek',
  status text default 'pending' check (status in ('pending', 'paid', 'failed')),
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.projects enable row level security;
alter table public.renders enable row level security;
alter table public.reviews enable row level security;
alter table public.quotes enable row level security;
alter table public.client_files enable row level security;
alter table public.payments enable row level security;

-- Public can read public projects
create policy "Public can view public projects"
  on public.projects for select
  using (is_public = true);

-- Public can read renders for public projects
create policy "Public can view renders of public projects"
  on public.renders for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = renders.project_id and p.is_public = true
    )
  );

-- Clients can view their own projects
create policy "Clients can view their own projects"
  on public.projects for select
  using (client_id = auth.uid());

-- Clients can view renders for their projects
create policy "Clients can view their project renders"
  on public.renders for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = renders.project_id and p.client_id = auth.uid()
    )
  );

-- Public can view approved reviews
create policy "Public can view approved reviews"
  on public.reviews for select
  using (approved = true);

-- Authenticated clients can submit reviews
create policy "Clients can submit reviews"
  on public.reviews for insert
  with check (auth.uid() is not null);

-- Anyone can submit a quote
create policy "Anyone can submit a quote"
  on public.quotes for insert
  with check (true);

-- Clients can view their own files
create policy "Clients can view their own files"
  on public.client_files for select
  using (uploaded_by = auth.uid());

-- Clients can upload files
create policy "Clients can upload files"
  on public.client_files for insert
  with check (uploaded_by = auth.uid());

-- Clients can view their own payments
create policy "Clients can view their payments"
  on public.payments for select
  using (client_id = auth.uid());
