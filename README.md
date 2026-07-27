# Movement Dynamics OS v2

Clean rebuild of the Movement Dynamics operating system.

## Phase 1 Scope

- Supabase Auth connection
- Login
- Password reset
- Auth callback
- Role-aware redirect
- Protected dashboards for admin, trainer, and client
- Admin read-only people table
- First database migration for profiles and role assignments

No booking, packages, payroll, approvals, or integrations are included yet.

## Local Setup

Copy `.env.example` to `.env.local` and fill in the values from Supabase and Vercel.

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
APP_TIMEZONE=Asia/Kuala_Lumpur
```

## Supabase Setup

Run migrations in order from `supabase/migrations`.

After creating the first admin user in Supabase Auth, grant the admin role:

```sql
insert into public.role_assignments (profile_id, role)
select id, 'admin'
from public.profiles
where email = 'your-email@example.com'
on conflict (profile_id, role) do nothing;
```

Password reset requires this redirect URL in Supabase Auth settings:

```text
https://your-vercel-domain.vercel.app/auth/callback
```
