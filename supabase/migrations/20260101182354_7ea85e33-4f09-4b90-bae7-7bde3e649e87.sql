-- Create delegates table for delegate pass registrations
CREATE TABLE public.delegates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    delegate_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    institution TEXT NOT NULL,
    tier TEXT NOT NULL,
    tier_price INTEGER NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_screenshot_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.delegates ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert delegate registrations
CREATE POLICY "Anyone can insert delegate registrations"
ON public.delegates
FOR INSERT
WITH CHECK (true);

-- Create policy for anyone to view delegate registrations (needed for delegate ID verification)
CREATE POLICY "Anyone can view delegate registrations"
ON public.delegates
FOR SELECT
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_delegates_updated_at
BEFORE UPDATE ON public.delegates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();