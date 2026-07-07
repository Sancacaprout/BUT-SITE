create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_type text not null,
  content_id text not null,
  status text not null,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null,
  score int not null,
  total int not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_id text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_id)
);

create table if not exists public.settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  theme text not null default 'system',
  text_size text not null default 'normal',
  show_motivational_messages boolean not null default true
);

create table if not exists public.learning_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.notes enable row level security;
alter table public.settings enable row level security;
alter table public.learning_state enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "progress_select_own" on public.progress
  for select using (auth.uid() = user_id);

create policy "progress_insert_own" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "progress_update_own" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "progress_delete_own" on public.progress
  for delete using (auth.uid() = user_id);

create policy "quiz_attempts_select_own" on public.quiz_attempts
  for select using (auth.uid() = user_id);

create policy "quiz_attempts_insert_own" on public.quiz_attempts
  for insert with check (auth.uid() = user_id);

create policy "notes_select_own" on public.notes
  for select using (auth.uid() = user_id);

create policy "notes_insert_own" on public.notes
  for insert with check (auth.uid() = user_id);

create policy "notes_update_own" on public.notes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "notes_delete_own" on public.notes
  for delete using (auth.uid() = user_id);

create policy "settings_select_own" on public.settings
  for select using (auth.uid() = user_id);

create policy "settings_insert_own" on public.settings
  for insert with check (auth.uid() = user_id);

create policy "settings_update_own" on public.settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "learning_state_select_own" on public.learning_state
  for select using (auth.uid() = user_id);

create policy "learning_state_insert_own" on public.learning_state
  for insert with check (auth.uid() = user_id);

create policy "learning_state_update_own" on public.learning_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "learning_state_delete_own" on public.learning_state
  for delete using (auth.uid() = user_id);
