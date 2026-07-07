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

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.progress to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
grant select, insert, update, delete on public.notes to authenticated;
grant select, insert, update on public.settings to authenticated;
grant select, insert, update, delete on public.learning_state to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;
drop policy if exists "progress_delete_own" on public.progress;
drop policy if exists "quiz_attempts_select_own" on public.quiz_attempts;
drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
drop policy if exists "notes_select_own" on public.notes;
drop policy if exists "notes_insert_own" on public.notes;
drop policy if exists "notes_update_own" on public.notes;
drop policy if exists "notes_delete_own" on public.notes;
drop policy if exists "settings_select_own" on public.settings;
drop policy if exists "settings_insert_own" on public.settings;
drop policy if exists "settings_update_own" on public.settings;
drop policy if exists "learning_state_select_own" on public.learning_state;
drop policy if exists "learning_state_insert_own" on public.learning_state;
drop policy if exists "learning_state_update_own" on public.learning_state;
drop policy if exists "learning_state_delete_own" on public.learning_state;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "progress_select_own" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "progress_insert_own" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "progress_update_own" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "progress_delete_own" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "quiz_attempts_select_own" on public.quiz_attempts
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "quiz_attempts_insert_own" on public.quiz_attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "notes_select_own" on public.notes
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "notes_insert_own" on public.notes
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "notes_update_own" on public.notes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "notes_delete_own" on public.notes
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "settings_select_own" on public.settings
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "settings_insert_own" on public.settings
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "settings_update_own" on public.settings
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "learning_state_select_own" on public.learning_state
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "learning_state_insert_own" on public.learning_state
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "learning_state_update_own" on public.learning_state
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "learning_state_delete_own" on public.learning_state
  for delete to authenticated using ((select auth.uid()) = user_id);
