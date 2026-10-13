-- 1. Create the 'hall-images' public bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hall-images', 'hall-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view images
CREATE POLICY "Give Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'hall-images' );

-- 3. Allow authenticated users to upload images
CREATE POLICY "Allow Uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'hall-images' );

-- 4. Allow authenticated users to delete images
CREATE POLICY "Allow Deletes" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'hall-images' );
