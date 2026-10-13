-- The 'minimum_capacity' column already exists, so we only need to update its values and set it to NOT NULL if not already done.

-- First, update any existing NULL values in minimum_capacity to a default (e.g., 1)
UPDATE meeting_halls
SET minimum_capacity = 1
WHERE minimum_capacity IS NULL;

-- Update minimum_capacity based on hall descriptions
UPDATE meeting_halls 
SET minimum_capacity = 5
WHERE name = 'Pranan';

UPDATE meeting_halls 
SET minimum_capacity = 10
WHERE name = 'Siruvani';

UPDATE meeting_halls 
SET minimum_capacity = 2
WHERE name = 'Ganga';

UPDATE meeting_halls 
SET minimum_capacity = 2
WHERE name = 'Ananta';

UPDATE meeting_halls 
SET minimum_capacity = 5
WHERE name = 'Vichitram';

-- Finally, make the column NOT NULL after setting all values
ALTER TABLE meeting_halls ALTER COLUMN minimum_capacity SET NOT NULL;
