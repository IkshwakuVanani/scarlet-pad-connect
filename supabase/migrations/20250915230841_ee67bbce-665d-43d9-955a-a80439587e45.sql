-- Add NetID column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN net_id TEXT;

-- Update the handle_new_user function to include net_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, net_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'net_id', '')
  );
  RETURN NEW;
END;
$$;