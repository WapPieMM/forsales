-- FORSALES database starter schema
-- Review submissions are private until an administrator approves them.
-- Review this file before running it in your own Supabase project.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 60),
  rating smallint not null check (rating between 1 and 5),
  review_text text not null check (char_length(review_text) between 1 and 1000),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

-- Visitors can read approved reviews only.
create policy "Anyone can read published reviews"
on public.reviews for select
to anon, authenticated
using (published = true);

-- Visitors can submit a review for moderation.
create policy "Anyone can submit a review"
on public.reviews for insert
to anon, authenticated
with check (published = false);

-- No public update/delete policies: moderation must be performed by a trusted admin.
