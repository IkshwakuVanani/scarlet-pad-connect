-- Create table for user listing interests (roommate matching)
CREATE TABLE public.listing_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  listing_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable Row Level Security
ALTER TABLE public.listing_interests ENABLE ROW LEVEL SECURITY;

-- Create policies for listing interests
CREATE POLICY "Users can view interests for listings they're interested in" 
ON public.listing_interests 
FOR SELECT 
USING (
  listing_id IN (
    SELECT listing_id FROM public.listing_interests WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own interests" 
ON public.listing_interests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interests" 
ON public.listing_interests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interests" 
ON public.listing_interests 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_listing_interests_updated_at
BEFORE UPDATE ON public.listing_interests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();