create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  event_date timestamptz not null,
  cover_image text,
  venue text,
  location text,
  quote text,
  hashtag text,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  image_url text not null,
  storage_path text not null,
  uploaded_by uuid,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  guest_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;
alter table public.photos enable row level security;
alter table public.messages enable row level security;

drop policy if exists "events are readable by everyone" on public.events;
create policy "events are readable by everyone"
on public.events
for select
to anon, authenticated
using (true);

drop policy if exists "photos are readable by everyone" on public.photos;
create policy "photos are readable by everyone"
on public.photos
for select
to anon, authenticated
using (true);

drop policy if exists "authenticated users can create photos" on public.photos;
create policy "guests can create photos"
on public.photos
for insert
to anon, authenticated
with check (uploaded_by is null or auth.uid() = uploaded_by);

drop policy if exists "messages are readable by everyone" on public.messages;
create policy "messages are readable by everyone"
on public.messages
for select
to anon, authenticated
using (true);

drop policy if exists "authenticated users can create messages" on public.messages;
create policy "guests can create messages"
on public.messages
for insert
to anon, authenticated
with check (true);

insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "event photos are publicly readable" on storage.objects;
create policy "event photos are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'event-photos');

drop policy if exists "authenticated users can upload event photos" on storage.objects;
create policy "guests can upload event photos"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'event-photos' and name like 'event-photos/%');

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'photos'
  ) then
    alter publication supabase_realtime add table public.photos;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end
$$;