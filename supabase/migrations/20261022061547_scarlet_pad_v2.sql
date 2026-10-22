-- Scarlet Pad v2. Fresh install or additive upgrade. Legacy records are retained.
begin;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

-- The only SECURITY DEFINER authorization helper. It reads the canonical Auth row,
-- never editable user_metadata or a stale JWT email. Auth users cannot set confirmation.
create or replace function private.pad_is_member() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.users u where u.id = (select auth.uid())
    and u.email_confirmed_at is not null
    and not coalesce(u.is_anonymous, false)
    and (u.banned_until is null or u.banned_until < now())
    and lower(split_part(u.email, '@', 2)) in ('rutgers.edu','scarletmail.rutgers.edu')
  );
$$;
revoke all on function private.pad_is_member() from public, anon;
grant execute on function private.pad_is_member() to authenticated;

-- Activate this Before User Created hook in the hosted Auth dashboard as well.
create function private.pad_before_user_created(event jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
begin
 if coalesce(event->'user'->>'is_anonymous','false')='true'
 or coalesce(lower(split_part(event->'user'->>'email','@',2)),'') not in ('rutgers.edu','scarletmail.rutgers.edu') then
   return '{"error":{"http_code":403,"message":"A Rutgers email address is required."}}'::jsonb;
 end if;
 return '{}'::jsonb;
end; $$;
revoke all on function private.pad_before_user_created(jsonb) from public,anon,authenticated;
grant usage on schema private to supabase_auth_admin;
grant execute on function private.pad_before_user_created(jsonb) to supabase_auth_admin;

create table public.pad_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(trim(title)) between 5 and 100),
  campus text not null check (campus in ('College Avenue','Busch','Livingston','Cook / Douglass')),
  location text not null check (length(trim(location)) between 1 and 150),
  price integer not null check (price between 1 and 20000),
  utilities integer not null default 0 check (utilities between 0 and 5000),
  bedrooms integer not null check (bedrooms between 1 and 20),
  bathrooms numeric(3,1) not null check (bathrooms between 0.5 and 20 and mod(bathrooms,0.5)=0),
  lease_term text not null check (lease_term in ('Academic year','12 months','Semester','Summer sublet','Flexible')),
  available_from date not null,
  description text not null check (length(trim(description)) between 30 and 3000),
  features text[] not null default '{}' check (features <@ array['Furnished','Laundry','Parking','Near campus']::text[]),
  photo_url text check (photo_url is null or (photo_url ~ '^https://' and length(photo_url)<=2000)),
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  created_at timestamptz not null default now(),
  check ((latitude is null) = (longitude is null))
);
create index pad_listings_owner on public.pad_listings(user_id);
create index pad_listings_campus_price on public.pad_listings(campus, price);
create table public.pad_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.pad_listings(id) on delete cascade,
  primary key(user_id, listing_id)
);
create table public.pad_roommates (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) between 1 and 60),
  major text not null check (length(trim(major)) between 1 and 80),
  campus text not null check (campus in ('College Avenue','Busch','Livingston','Cook / Douglass')),
  budget integer not null check (budget between 1 and 20000),
  sleep text not null check (sleep in ('Early bird','Night owl','Flexible')),
  tidy text not null check (tidy in ('Very tidy','Relaxed')),
  social text not null check (social in ('Quiet home','Social home','A balance')),
  bio text not null check (length(trim(bio)) between 20 and 600),
  is_visible boolean not null default true
);
create table public.pad_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null check (jsonb_typeof(data)='object' and octet_length(data::text)<16000)
);
create table public.pad_connections (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  target_listing uuid references public.pad_listings(id) on delete set null,
  target_label text not null check (length(target_label) between 1 and 100),
  note text not null check (length(trim(note)) between 10 and 800),
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  check (from_user <> to_user), unique (from_user, to_user)
);
create index pad_connections_recipient on public.pad_connections(to_user);
create index pad_connections_listing on public.pad_connections(target_listing);

-- Derive recipient and label from an accessible target; never trust caller-supplied labels.
create function private.pad_validate_connection() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare recipient uuid; label text;
begin
  if new.target_listing is not null then
    select user_id,title into recipient,label from public.pad_listings where id=new.target_listing;
  else
    select user_id,display_name into recipient,label from public.pad_roommates where user_id=new.to_user and is_visible;
  end if;
  if recipient is null or recipient <> new.to_user then raise exception 'Connection target unavailable'; end if;
  new.target_label := label;
  new.status := 'pending';
  new.created_at := now();
  return new;
end; $$;
revoke all on function private.pad_validate_connection() from public;
create trigger pad_connection_target before insert on public.pad_connections
for each row execute function private.pad_validate_connection();

alter table public.pad_listings enable row level security;
alter table public.pad_saves enable row level security;
alter table public.pad_roommates enable row level security;
alter table public.pad_plans enable row level security;
alter table public.pad_connections enable row level security;

revoke all on public.pad_listings,public.pad_saves,public.pad_roommates,public.pad_plans,public.pad_connections from public,anon,authenticated;
grant select,insert,delete on public.pad_listings to authenticated;
grant select,insert,delete on public.pad_saves to authenticated;
grant select,insert,update,delete on public.pad_roommates,public.pad_plans to authenticated;
grant select,insert on public.pad_connections to authenticated;
-- Only a recipient may change status; caller cannot alter the participants or message.
grant update(status) on public.pad_connections to authenticated;

create policy pad_listing_read on public.pad_listings for select to authenticated using ((select private.pad_is_member()));
create policy pad_listing_create on public.pad_listings for insert to authenticated with check ((select private.pad_is_member()) and (select auth.uid())=user_id);
create policy pad_listing_delete on public.pad_listings for delete to authenticated using ((select private.pad_is_member()) and (select auth.uid())=user_id);
create policy pad_saves_read on public.pad_saves for select to authenticated using ((select private.pad_is_member()) and (select auth.uid())=user_id);
create policy pad_saves_create on public.pad_saves for insert to authenticated with check ((select private.pad_is_member()) and (select auth.uid())=user_id);
create policy pad_saves_delete on public.pad_saves for delete to authenticated using ((select private.pad_is_member()) and (select auth.uid())=user_id);
create policy pad_roommates_read on public.pad_roommates for select to authenticated using ((select private.pad_is_member()) and (is_visible or user_id=(select auth.uid())));
create policy pad_roommates_create on public.pad_roommates for insert to authenticated with check ((select private.pad_is_member()) and user_id=(select auth.uid()));
create policy pad_roommates_edit on public.pad_roommates for update to authenticated using ((select private.pad_is_member()) and user_id=(select auth.uid())) with check ((select private.pad_is_member()) and user_id=(select auth.uid()));
create policy pad_roommates_delete on public.pad_roommates for delete to authenticated using ((select private.pad_is_member()) and user_id=(select auth.uid()));
create policy pad_plan_read on public.pad_plans for select to authenticated using ((select private.pad_is_member()) and user_id=(select auth.uid()));
create policy pad_plan_create on public.pad_plans for insert to authenticated with check ((select private.pad_is_member()) and user_id=(select auth.uid()));
create policy pad_plan_edit on public.pad_plans for update to authenticated using ((select private.pad_is_member()) and user_id=(select auth.uid())) with check ((select private.pad_is_member()) and user_id=(select auth.uid()));
create policy pad_plan_delete on public.pad_plans for delete to authenticated using ((select private.pad_is_member()) and user_id=(select auth.uid()));
create policy pad_connection_read on public.pad_connections for select to authenticated using ((select private.pad_is_member()) and (select auth.uid()) in (from_user,to_user));
create policy pad_connection_create on public.pad_connections for insert to authenticated with check ((select private.pad_is_member()) and from_user=(select auth.uid()) and status='pending');
create policy pad_connection_respond on public.pad_connections for update to authenticated using ((select private.pad_is_member()) and to_user=(select auth.uid()) and status='pending') with check ((select private.pad_is_member()) and to_user=(select auth.uid()) and status in ('accepted','declined'));

-- Invoker RPC reads a deliberately restricted view of Auth contact information via a
-- private helper. The helper explicitly checks caller, consent and both memberships.
create function private.pad_contact_email(connection_id uuid) returns text
language sql stable security definer set search_path = '' as $$
 select u.email from public.pad_connections c
 join auth.users u on u.id=case when c.from_user=(select auth.uid()) then c.to_user else c.from_user end
 where c.id=connection_id and c.status='accepted' and (select auth.uid()) in (c.from_user,c.to_user)
 and private.pad_is_member() and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
 and (u.banned_until is null or u.banned_until < now())
 and lower(split_part(u.email,'@',2)) in ('rutgers.edu','scarletmail.rutgers.edu');
$$;
revoke all on function private.pad_contact_email(uuid) from public,anon;
grant execute on function private.pad_contact_email(uuid) to authenticated;
create function public.pad_connection_email(connection_id uuid) returns text
language sql stable security invoker set search_path = '' as $$ select private.pad_contact_email(connection_id); $$;
revoke all on function public.pad_connection_email(uuid) from public,anon;
grant execute on function public.pad_connection_email(uuid) to authenticated;

-- Disable obsolete Data API access on upgrade without deleting legacy records.
do $$
declare legacy text;
begin
 foreach legacy in array array['profiles','listings','listing_interests','transactions','payment_preferences','rent_schedules'] loop
   if to_regclass('public.'||legacy) is not null then
     execute format('revoke all on public.%I from anon, authenticated',legacy);
   end if;
 end loop;
end; $$;
-- Existing image bucket must stop serving public URLs. Old object policies are not
-- reused by v2. Revoke the specifically named legacy bucket policies when present.
do $$
declare policy_name text;
begin
 if to_regclass('storage.buckets') is not null then
   update storage.buckets set public=false where id='listing-images';
 end if;
 if to_regclass('storage.objects') is not null then
   foreach policy_name in array array['Anyone can view listing images','Users can upload listing images','Users can update their own listing images','Users can delete their own listing images','Listing images are publicly accessible','Authenticated users can upload listing images'] loop
     execute format('drop policy if exists %I on storage.objects',policy_name);
   end loop;
 end if;
end; $$;
commit;
