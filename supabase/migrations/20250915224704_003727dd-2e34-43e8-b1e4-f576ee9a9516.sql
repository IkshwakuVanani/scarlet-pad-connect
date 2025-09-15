-- Create transactions table for all payment types
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  listing_id UUID NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('rent_payment', 'security_deposit', 'application_fee', 'premium_listing')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('platform', 'direct')),
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT NULL,
  stripe_subscription_id TEXT NULL,
  recipient_user_id UUID NULL, -- For direct payments, who receives the money
  platform_fee INTEGER NULL, -- Platform fee in cents if payment goes through RU Housing
  metadata JSONB NULL, -- Additional transaction data
  due_date DATE NULL, -- For rent payments
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment preferences table
CREATE TABLE public.payment_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  preferred_method TEXT NOT NULL CHECK (preferred_method IN ('platform', 'direct')) DEFAULT 'platform',
  stripe_account_id TEXT NULL, -- For direct payments via Stripe Connect
  platform_fee_percentage DECIMAL(5,2) DEFAULT 3.5, -- Default 3.5% platform fee
  auto_rent_payment BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recurring rent schedules table
CREATE TABLE public.rent_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  landlord_id UUID NOT NULL,
  monthly_amount INTEGER NOT NULL, -- Amount in cents
  due_day_of_month INTEGER NOT NULL CHECK (due_day_of_month >= 1 AND due_day_of_month <= 31),
  lease_start DATE NOT NULL,
  lease_end DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('platform', 'direct')),
  stripe_subscription_id TEXT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = recipient_user_id);

CREATE POLICY "Users can create transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = recipient_user_id);

-- RLS policies for payment preferences
CREATE POLICY "Users can view their own payment preferences" 
ON public.payment_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment preferences" 
ON public.payment_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment preferences" 
ON public.payment_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for rent schedules
CREATE POLICY "Users can view rent schedules they're involved in" 
ON public.rent_schedules 
FOR SELECT 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

CREATE POLICY "Landlords can create rent schedules" 
ON public.rent_schedules 
FOR INSERT 
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update rent schedules" 
ON public.rent_schedules 
FOR UPDATE 
USING (auth.uid() = landlord_id);

-- Add triggers for updated_at
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_preferences_updated_at
BEFORE UPDATE ON public.payment_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rent_schedules_updated_at
BEFORE UPDATE ON public.rent_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_listing_id ON public.transactions(listing_id);
CREATE INDEX idx_transactions_type_status ON public.transactions(transaction_type, status);
CREATE INDEX idx_rent_schedules_tenant_id ON public.rent_schedules(tenant_id);
CREATE INDEX idx_rent_schedules_landlord_id ON public.rent_schedules(landlord_id);
CREATE INDEX idx_rent_schedules_listing_id ON public.rent_schedules(listing_id);