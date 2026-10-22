begin;
-- Canonical membership is checked on every request; only exact Rutgers domains qualify.
create or replace function private.pad_is_member() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from auth.users u where u.id=(select auth.uid())
 and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
 and (u.banned_until is null or u.banned_until<now())
 and u.email ~* '^[^[:space:]@]+@(rutgers[.]edu|scarletmail[.]rutgers[.]edu)$');
$$;
-- Also enforce the allowlist at the Auth table boundary, independent of dashboard hooks.
create function private.pad_require_rutgers_email() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if coalesce(new.is_anonymous,false) or coalesce(new.email,'') !~* '^[^[:space:]@]+@(rutgers[.]edu|scarletmail[.]rutgers[.]edu)$' then
  raise exception 'A Rutgers email address is required.' using errcode='23514';
 end if;
 return new;
end; $$;
revoke all on function private.pad_require_rutgers_email() from public,anon,authenticated;
create trigger pad_require_rutgers_email before insert or update of email,is_anonymous on auth.users
for each row execute function private.pad_require_rutgers_email();
alter table public.pad_listings add column photo_path text;
alter table public.pad_listings add constraint pad_listing_photo_owner check (photo_path is null or (photo_path like user_id::text||'/%' and length(photo_path)<240));
-- Actual photos are private objects, not remote tracking URLs.
alter table public.pad_listings add constraint pad_no_remote_photo check(photo_url is null);
grant update(title,campus,location,price,utilities,bedrooms,bathrooms,lease_term,available_from,description,features,photo_path,latitude,longitude) on public.pad_listings to authenticated;
create policy pad_listing_edit on public.pad_listings for update to authenticated
using ((select private.pad_is_member()) and user_id=(select auth.uid()))
with check ((select private.pad_is_member()) and user_id=(select auth.uid()));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('pad-listing-photos','pad-listing-photos',false,5242880,array['image/jpeg','image/png','image/webp']);
create policy pad_photo_read on storage.objects for select to authenticated
using(bucket_id='pad-listing-photos' and (select private.pad_is_member()) and (
 (storage.foldername(name))[1]=(select auth.uid())::text or exists(select 1 from public.pad_listings l where l.photo_path=name)));
create policy pad_photo_upload on storage.objects for insert to authenticated
with check(bucket_id='pad-listing-photos' and (select private.pad_is_member()) and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy pad_photo_delete on storage.objects for delete to authenticated
using(bucket_id='pad-listing-photos' and (select private.pad_is_member()) and (storage.foldername(name))[1]=(select auth.uid())::text);
commit;
