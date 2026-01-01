-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT NOT NULL UNIQUE,
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  category_name TEXT NOT NULL,
  
  -- Lead registrant info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  year TEXT,
  institution TEXT NOT NULL,
  participant_category TEXT DEFAULT 'student',
  
  -- Team and payment info
  team_members JSONB NOT NULL DEFAULT '[]',
  delegate_id TEXT,
  coupon_code TEXT,
  payment_screenshot_url TEXT,
  fee_amount INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can register)
CREATE POLICY "Anyone can insert registrations"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Allow public reads (for admin dashboard later, can be restricted)
CREATE POLICY "Anyone can view registrations"
ON public.registrations
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries by event and category
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX idx_registrations_category ON public.registrations(category_name);
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at DESC);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true);

-- Allow public uploads to payment screenshots bucket
CREATE POLICY "Anyone can upload payment screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow public access to payment screenshots
CREATE POLICY "Anyone can view payment screenshots"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-screenshots');