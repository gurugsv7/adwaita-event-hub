-- Make payment-screenshots bucket private instead of public
UPDATE storage.buckets 
SET public = false 
WHERE id = 'payment-screenshots';

-- Drop the public access policy
DROP POLICY IF EXISTS "Anyone can view payment screenshots" ON storage.objects;

-- Create policy for authenticated users to upload payment screenshots
DROP POLICY IF EXISTS "Authenticated users can upload payment screenshots" ON storage.objects;
CREATE POLICY "Authenticated users can upload payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots');

-- Create policy for service role to read payment screenshots (for admin access)
DROP POLICY IF EXISTS "Service role can read payment screenshots" ON storage.objects;
CREATE POLICY "Service role can read payment screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-screenshots' AND auth.role() = 'service_role');