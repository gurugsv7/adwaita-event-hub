-- Make payment-screenshots bucket public again
UPDATE storage.buckets 
SET public = true 
WHERE id = 'payment-screenshots';

-- Recreate the public access policy
CREATE POLICY "Anyone can view payment screenshots public"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-screenshots');