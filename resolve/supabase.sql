-- Run once in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists records (
  id text primary key,
  t text not null check (t in ('booking','ticket','lead')),
  name text, text text, meta text, phone text,
  time_label text,
  st text default 'Open',
  tech text default 'Unassigned',
  notes jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists kb_articles (
  id bigint generated always as identity primary key,
  t text not null,
  cat text,
  k text[] default '{}',
  a text not null,
  created_at timestamptz default now()
);

alter table records enable row level security;
alter table kb_articles enable row level security;

-- DEMO POLICIES: anyone holding the anon key can read/write everything.
-- Fine for a demo. Before real customers use it, replace with Supabase Auth
-- policies (visitors: insert only; authenticated staff: read/update/delete).
drop policy if exists "demo all" on records;
drop policy if exists "demo all" on kb_articles;
create policy "demo all" on records for all using (true) with check (true);
create policy "demo all" on kb_articles for all using (true) with check (true);
