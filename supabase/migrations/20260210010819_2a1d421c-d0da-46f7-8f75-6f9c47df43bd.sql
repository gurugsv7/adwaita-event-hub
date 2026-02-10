
-- Create merch_orders table
CREATE TABLE public.merch_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  institution TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount INTEGER NOT NULL DEFAULT 0,
  payment_screenshot_url TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.merch_orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert merch orders
CREATE POLICY "Anyone can insert merch orders"
ON public.merch_orders
FOR INSERT
WITH CHECK (true);

-- Only service role can read merch orders
CREATE POLICY "Only service role can read merch orders"
ON public.merch_orders
FOR SELECT
USING (auth.role() = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_merch_orders_updated_at
BEFORE UPDATE ON public.merch_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
