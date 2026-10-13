-- Update image paths to use public folder structure
UPDATE meeting_halls 
SET image_url = '/Images/pranan.jpg'
WHERE name = 'Pranan';

UPDATE meeting_halls 
SET image_url = '/Images/Siruvani.jpg'
WHERE name = 'Siruvani';

UPDATE meeting_halls 
SET image_url = '/Images/ganga.jpg'
WHERE name = 'Ganga';

UPDATE meeting_halls 
SET image_url = '/Images/ananta.jpg'
WHERE name = 'Ananta';

UPDATE meeting_halls 
SET image_url = '/Images/Vichitram.jpg'
WHERE name = 'Vichitram';
