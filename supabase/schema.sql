create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  preferred_locale text not null default 'en'
    check (preferred_locale in ('en', 'ko')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name_en text not null,
  name_ko text not null,
  description_en text,
  description_ko text,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  category_id text not null references public.categories(id) on delete restrict,
  name_en text not null,
  name_ko text,
  description_en text,
  description_ko text,
  image_url text,
  extra jsonb not null default '{}'::jsonb,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  unique (category_id, external_id)
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  category_id text not null references public.categories(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (user_id, item_id)
);

create index if not exists items_category_id_idx
  on public.items(category_id);
create index if not exists votes_item_id_idx
  on public.votes(item_id);
create index if not exists votes_user_id_idx
  on public.votes(user_id);
create index if not exists votes_category_id_idx
  on public.votes(category_id);

create or replace view public.vote_counts
with (security_invoker = true)
as
select
  i.id as item_id,
  count(v.id)::bigint as vote_count,
  dense_rank() over (
    partition by i.category_id
    order by count(v.id) desc, i.name_en asc
  )::bigint as rank
from public.items i
left join public.votes v on v.item_id = i.id
group by i.id, i.category_id, i.name_en;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, avatar_url, preferred_locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url',
    'en'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.votes enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Categories are publicly readable" on public.categories;
create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

drop policy if exists "Items are publicly readable" on public.items;
create policy "Items are publicly readable"
  on public.items for select
  using (true);

drop policy if exists "Votes are publicly readable" on public.votes;
create policy "Votes are publicly readable"
  on public.votes for select
  using (true);

drop policy if exists "Users can insert their votes" on public.votes;
create policy "Users can insert their votes"
  on public.votes for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and category_id = (
      select category_id from public.items where id = item_id
    )
  );

drop policy if exists "Users can delete their votes" on public.votes;
create policy "Users can delete their votes"
  on public.votes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.profiles from anon, authenticated;
revoke all on public.categories from anon, authenticated;
revoke all on public.items from anon, authenticated;
revoke all on public.votes from anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.items to anon, authenticated;
grant select on public.votes to anon, authenticated;
grant insert, delete on public.votes to authenticated;
grant select on public.vote_counts to anon, authenticated;
