-- Enable RLS on listings table if not already enabled
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for listings table
CREATE POLICY IF NOT EXISTS "Users can view all listings" 
ON public.listings 
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can create listings" 
ON public.listings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Users can update their own listings" 
ON public.listings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own listings" 
ON public.listings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage policies for listing-images bucket
CREATE POLICY IF NOT EXISTS "Listing images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'listing-images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload listing images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'listing-images' AND auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Users can update their own listing images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'listing-images' AND auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Users can delete their own listing images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'listing-images' AND auth.uid() IS NOT NULL);