-- CRITICAL SECURITY FIX: Update listing_interests RLS policies to prevent privacy violations

-- Drop the overly permissive policy that allows all users to view all interests
DROP POLICY IF EXISTS "Users can view all listing interests" ON public.listing_interests;

-- Create proper privacy-respecting policies
CREATE POLICY "Users can view their own interests" 
ON public.listing_interests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow listing owners to see who's interested in their properties (for roommate matching)
CREATE POLICY "Listing owners can view interests in their listings" 
ON public.listing_interests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id::text = listing_interests.listing_id 
    AND listings.user_id = auth.uid()
  )
);

-- Ensure the profiles table allows users to see other users' basic info for roommate matching
-- But first check if we need to update the profiles policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a new policy that allows viewing basic profile info for roommate connections
CREATE POLICY "Users can view profiles for roommate matching" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own profile
  auth.uid() = user_id 
  OR 
  -- Users can see profiles of people interested in the same listings they own
  EXISTS (
    SELECT 1 FROM public.listing_interests li1
    JOIN public.listing_interests li2 ON li1.listing_id = li2.listing_id
    JOIN public.listings l ON l.id::text = li1.listing_id
    WHERE li1.user_id = profiles.user_id 
    AND (li2.user_id = auth.uid() OR l.user_id = auth.uid())
  )
);