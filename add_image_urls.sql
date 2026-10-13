ALTER TABLE meeting_halls ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

UPDATE meeting_halls
SET image_urls = ARRAY[image_url]
WHERE image_urls = '{}' OR image_urls IS NULL;
