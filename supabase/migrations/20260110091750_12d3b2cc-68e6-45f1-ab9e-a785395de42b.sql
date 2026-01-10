-- Add explicit SELECT policies that only allow service_role access
-- This ensures sensitive PII data cannot be read via the public API

-- Concert bookings - only service_role can read
CREATE POLICY "Only service role can read concert bookings"
ON public.concert_bookings
FOR SELECT
USING (auth.role() = 'service_role');

-- Delegates - only service_role can read
CREATE POLICY "Only service role can read delegates"
ON public.delegates
FOR SELECT
USING (auth.role() = 'service_role');

-- Registrations - only service_role can read
CREATE POLICY "Only service role can read registrations"
ON public.registrations
FOR SELECT
USING (auth.role() = 'service_role');