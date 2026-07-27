# Supabase Setup

Run migrations in order from `supabase/migrations`.

For the first admin account:

1. Invite or create the user in Supabase Auth.
2. After the profile exists, run:

```sql
insert into public.role_assignments (profile_id, role)
select id, 'admin'
from public.profiles
where email = 'your-email@example.com'
on conflict (profile_id, role) do nothing;
```

Password reset requires this URL in Supabase Auth redirect allow list:

```text
https://your-vercel-domain.vercel.app/auth/callback
```
