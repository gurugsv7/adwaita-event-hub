-- Create storage bucket for site assets like hero video
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true);

-- Allow public read access to site assets
CREATE POLICY "Public read access for site assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-assets');