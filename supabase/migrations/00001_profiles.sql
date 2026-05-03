-- Production-ready profile rows linked to auth.users. App reads display name from JWT metadata;
-- this table is for RLS-governed server queries and future features (addresses, roles, etc.).
-- Apply in Supabase SQL editor or: supabase db push (CLI).

create table if not exists public.profiles (
  id uuid not null primary key references auth.users (id) on delete cascade,
  full_name text,
  updated_at timestamptz not null default now()
);

comment on table public.profiles is '1:1 with auth.users; optional mirror of user_metadata for SQL access under RLS.';

create index if not exists profiles_updated_at_idx on public.profiles (updated_at desc);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- New signups: create profile from raw_user_meta_data (matches storefront signup `full_name`).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
