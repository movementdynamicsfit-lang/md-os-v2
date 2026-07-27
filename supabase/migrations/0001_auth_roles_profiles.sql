-- Movement Dynamics OS v2 - 0001 auth, profiles, and roles.
-- Keep this migration deliberately small. Feature tables come later.

begin;

create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'trainer', 'client');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  avatar_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_assignments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  granted_by uuid references public.profiles(id),
  granted_at timestamptz not null default now(),
  unique (profile_id, role)
);

create index idx_role_assignments_profile on public.role_assignments(profile_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.has_role(check_role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.role_assignments
    where profile_id = auth.uid()
      and role = check_role
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('admin');
$$;

create or replace function public.get_my_roles()
returns text[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(role::text order by role::text), '{}')
  from public.role_assignments
  where profile_id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.role_assignments enable row level security;

create policy profiles_select_self_or_admin on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy profiles_update_self_or_admin on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy profiles_insert_self_or_admin on public.profiles
  for insert with check (id = auth.uid() or public.is_admin());

create policy roles_select_self_or_admin on public.role_assignments
  for select using (profile_id = auth.uid() or public.is_admin());

create policy roles_admin_write on public.role_assignments
  for all using (public.is_admin()) with check (public.is_admin());

revoke all on function public.has_role(public.app_role) from public;
revoke all on function public.is_admin() from public;
revoke all on function public.get_my_roles() from public;

grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.get_my_roles() to authenticated;

commit;
