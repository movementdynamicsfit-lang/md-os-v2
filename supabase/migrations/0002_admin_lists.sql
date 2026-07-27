-- Movement Dynamics OS v2 - 0002 admin lists/settings.
-- Shared lookup tables used by admin, trainer, and client features later.

begin;

create table public.monthly_targets (
  id uuid primary key default gen_random_uuid(),
  target_month date not null unique,
  session_target int not null default 0 check (session_target >= 0),
  enquiry_target int not null default 0 check (enquiry_target >= 0),
  revenue_target numeric(12,2) not null default 0 check (revenue_target >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trainer_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  display_name text not null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.package_catalogue (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  session_count int not null check (session_count > 0),
  price numeric(12,2) not null check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_monthly_targets_updated
before update on public.monthly_targets
for each row execute function public.set_updated_at();

create trigger trg_trainer_profiles_updated
before update on public.trainer_profiles
for each row execute function public.set_updated_at();

create trigger trg_locations_updated
before update on public.locations
for each row execute function public.set_updated_at();

create trigger trg_lead_sources_updated
before update on public.lead_sources
for each row execute function public.set_updated_at();

create trigger trg_package_catalogue_updated
before update on public.package_catalogue
for each row execute function public.set_updated_at();

alter table public.monthly_targets enable row level security;
alter table public.trainer_profiles enable row level security;
alter table public.locations enable row level security;
alter table public.lead_sources enable row level security;
alter table public.package_catalogue enable row level security;

create policy monthly_targets_admin_all on public.monthly_targets
  for all using (public.is_admin()) with check (public.is_admin());

create policy trainer_profiles_read_authenticated on public.trainer_profiles
  for select using (auth.uid() is not null and (is_active or public.is_admin()));
create policy trainer_profiles_admin_all on public.trainer_profiles
  for all using (public.is_admin()) with check (public.is_admin());

create policy locations_read_authenticated on public.locations
  for select using (auth.uid() is not null and (is_active or public.is_admin()));
create policy locations_admin_all on public.locations
  for all using (public.is_admin()) with check (public.is_admin());

create policy lead_sources_read_authenticated on public.lead_sources
  for select using (auth.uid() is not null and (is_active or public.is_admin()));
create policy lead_sources_admin_all on public.lead_sources
  for all using (public.is_admin()) with check (public.is_admin());

create policy package_catalogue_read_authenticated on public.package_catalogue
  for select using (auth.uid() is not null and (is_active or public.is_admin()));
create policy package_catalogue_admin_all on public.package_catalogue
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.locations (name) values
  ('Ascaro, 1 Utama'),
  ('Movement Dynamics, Damansara Heights')
on conflict (name) do nothing;

insert into public.lead_sources (name) values
  ('Google Ads'),
  ('Instagram Ads'),
  ('Referral')
on conflict (name) do nothing;

insert into public.package_catalogue (name, session_count, price) values
  ('1-on-1 - 10 sessions', 10, 3600),
  ('1-on-1 - 20 sessions', 20, 6800),
  ('1-on-1 - 5 sessions', 5, 1900),
  ('2-on-1 - 10 sessions', 10, 3200),
  ('2-on-1 - 20 sessions', 20, 5800),
  ('2-on-1 - 5 sessions', 5, 1600)
on conflict (name) do nothing;

commit;
