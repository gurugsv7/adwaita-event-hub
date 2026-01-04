-- Create concert_bookings table for Krishh concert ticket bookings
CREATE TABLE public.concert_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  institution TEXT NOT NULL,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('stag', 'couple')),
  ticket_price INTEGER NOT NULL,
  partner_name TEXT,
  partner_phone TEXT,
  payment_screenshot_url TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.concert_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert concert bookings
CREATE POLICY "Anyone can insert concert bookings" 
ON public.concert_bookings 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_concert_bookings_updated_at
BEFORE UPDATE ON public.concert_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();