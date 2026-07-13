-- FurFinds public website database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Safe to re-run: every statement is guarded.
--
-- NOTE: this schema is intentionally kept separate from FurFinds HQ's
-- `public.profiles` table (which is scoped to the `hq_role` enum and grants
-- access to the internal HQ dashboard). Consumer/business accounts created
-- on the public website use `site_profiles` + `site_reviews` below instead,
-- so a pet owner or business signing up here can never end up with an HQ
-- staff profile even if both apps point at the same Supabase project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- site_profiles — pet owners and businesses who sign up on the public site
-- ---------------------------------------------------------------------------
create table if not exists public.site_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'pet_owner' check (role in ('pet_owner', 'business')),
  pets jsonb not null default '[]',
  notification_prefs jsonb not null default '{"email_updates": true, "review_replies": true}',
  created_at timestamptz not null default now()
);

-- Auto-create a site_profiles row whenever a new auth user signs up through
-- the public site. Client-side upserts (in signup/login/callback pages)
-- cover the common cases; this trigger is the safety net for auth users
-- created without a client round-trip (e.g. directly in the dashboard) and
-- guarantees a row exists even if a signup is interrupted before the
-- client-side upsert runs.
create or replace function public.handle_new_site_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.site_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    case
      when new.raw_user_meta_data ->> 'account_type' = 'business' then 'business'
      else 'pet_owner'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_site on auth.users;
create trigger on_auth_user_created_site
  after insert on auth.users
  for each row execute procedure public.handle_new_site_user();

-- ---------------------------------------------------------------------------
-- site_reviews — reviews left by pet owners on business profile pages
-- ---------------------------------------------------------------------------
create table if not exists public.site_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.site_profiles (id) on delete cascade,
  -- Denormalized display name at time of posting, so the review card can
  -- render without a join. Also lets editorial/seed reviews (no real
  -- account behind them, user_id null) show a byline.
  author_name text,
  business_slug text not null,
  business_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  photo_url text,
  created_at timestamptz not null default now()
);

alter table public.site_reviews add column if not exists author_name text;

create index if not exists site_reviews_user_id_idx on public.site_reviews (user_id);
create index if not exists site_reviews_business_slug_idx on public.site_reviews (business_slug);

-- ---------------------------------------------------------------------------
-- Base grants
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on public.site_profiles to authenticated;
grant select, insert, update, delete on public.site_reviews to authenticated;
grant select on public.site_reviews to anon;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.site_profiles enable row level security;
alter table public.site_reviews enable row level security;

drop policy if exists "site_profiles_select_self" on public.site_profiles;
create policy "site_profiles_select_self" on public.site_profiles
  for select using (auth.uid() = id);

drop policy if exists "site_profiles_insert_self" on public.site_profiles;
create policy "site_profiles_insert_self" on public.site_profiles
  for insert with check (auth.uid() = id);

drop policy if exists "site_profiles_update_self" on public.site_profiles;
create policy "site_profiles_update_self" on public.site_profiles
  for update using (auth.uid() = id);

drop policy if exists "site_reviews_select_all" on public.site_reviews;
create policy "site_reviews_select_all" on public.site_reviews
  for select using (true);

drop policy if exists "site_reviews_insert_self" on public.site_reviews;
create policy "site_reviews_insert_self" on public.site_reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "site_reviews_update_self" on public.site_reviews;
create policy "site_reviews_update_self" on public.site_reviews
  for update using (auth.uid() = user_id);

drop policy if exists "site_reviews_delete_self" on public.site_reviews;
create policy "site_reviews_delete_self" on public.site_reviews
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed reviews for the curated launch business listings (see
-- FurFinds-HQ/supabase/schema.sql for the matching businesses insert).
-- user_id is null — these are editorial/launch reviews, not tied to a real
-- site_profiles account. Fixed ids make this safe to re-run.
-- ---------------------------------------------------------------------------
insert into public.site_reviews (id, user_id, author_name, business_slug, business_name, rating, comment)
values
  ('00000000-0000-4000-8000-000000000001', null, 'Marisol P.', 'the-hound-house-cafe', 'The Hound House Cafe', 5, 'My golden retriever has his own regular seat here. Staff know him by name!'),
  ('00000000-0000-4000-8000-000000000002', null, 'Devon K.', 'the-hound-house-cafe', 'The Hound House Cafe', 5, 'Best patio in the city for a coffee date with your dog.'),
  ('00000000-0000-4000-8000-000000000003', null, 'Alan R.', 'wagging-tail-inn', 'Wagging Tail Inn', 5, 'They treated our senior dog like royalty. Will always book here.'),
  ('00000000-0000-4000-8000-000000000004', null, 'Priya S.', 'riverside-bark-park', 'Riverside Bark Park', 4, 'Great space, gets crowded on weekends but well maintained.'),
  ('00000000-0000-4000-8000-000000000005', null, 'Jamie L.', 'paws-and-claws-boutique', 'Paws & Claws Boutique', 5, 'Staff let my cat sniff every toy before we bought it. So sweet.'),
  ('00000000-0000-4000-8000-000000000006', null, 'Nora T.', 'furry-friends-grooming-studio', 'Furry Friends Grooming Studio', 5, 'The only groomer my anxious rescue dog has ever been calm with.'),
  ('00000000-0000-4000-8000-000000000007', null, 'Chris B.', 'cornerstone-veterinary-clinic', 'Cornerstone Veterinary Clinic', 5, 'They saved our cat''s life on a Sunday night. Forever grateful.'),
  ('00000000-0000-4000-8000-000000000008', null, 'Elena V.', 'yappy-hour-pet-events', 'Yappy Hour Pet Events', 5, 'Adopted our second dog at one of their events. Wonderful community.'),
  ('00000000-0000-4000-8000-000000000009', null, 'Tom H.', 'petcab-rides', 'PetCab Rides', 4, 'Great for vet trips when I don''t have my own car.')
on conflict (id) do nothing;
