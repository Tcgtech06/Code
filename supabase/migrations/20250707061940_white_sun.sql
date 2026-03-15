/*
  # Add resume storage functionality

  1. Storage
    - Create storage bucket for resumes
    - Set up RLS policies for resume access

  2. Security
    - Allow public read access to resumes
    - Allow authenticated users to upload resumes
*/

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to resumes
CREATE POLICY "Public read access for resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

-- Allow authenticated users to upload resumes
CREATE POLICY "Allow resume uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

-- Allow users to update their own resumes
CREATE POLICY "Allow resume updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'resumes');

-- Allow users to delete their own resumes
CREATE POLICY "Allow resume deletions"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'resumes');