-- Fix the INSERT policy for listings table to allow authenticated users to create listings
DROP POLICY IF EXISTS "Users can create their own listings" ON public.listings;

CREATE POLICY "Users can create their own listings" 
ON public.listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);