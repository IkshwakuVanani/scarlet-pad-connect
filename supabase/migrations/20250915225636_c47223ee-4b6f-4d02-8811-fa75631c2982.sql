-- Fix infinite recursion in listing_interests RLS policies
-- Drop the problematic policy that references itself
DROP POLICY IF EXISTS "Users can view interests for listings they're interested in" ON public.listing_interests;

-- Create a simpler policy that allows users to see all listing interests
-- This is needed for the roommates feature to work properly
CREATE POLICY "Users can view all listing interests" 
ON public.listing_interests 
FOR SELECT 
USING (true);

-- Alternatively, if we want more restrictive access, we could use:
-- CREATE POLICY "Users can view listing interests" 
-- ON public.listing_interests 
-- FOR SELECT 
-- USING (auth.uid() IS NOT NULL);