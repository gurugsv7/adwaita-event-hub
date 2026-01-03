-- Drop the public SELECT policy on registrations table
DROP POLICY IF EXISTS "Anyone can view registrations" ON public.registrations;

-- Drop the public SELECT policy on delegates table (same issue)
DROP POLICY IF EXISTS "Anyone can view delegate registrations" ON public.delegates;

-- Create restrictive policies that only allow service role access (no public read)
-- This ensures data can only be accessed through backend/admin tools, not public API