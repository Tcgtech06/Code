-- Update hall descriptions with new format showing min/max occupancy
UPDATE meeting_halls 
SET description = 'PRANAN MEETING HALL - OCCUPENCY : MINIMUM - 5 MEMBERS MAXIMUM - 10 MEMBERS'
WHERE name = 'Pranan';

UPDATE meeting_halls 
SET description = 'SIRUVANI MEETING HALL - OCCUPENCY : MINIMUM - 10 MEMBERS MAXIMUM - 15 MEMBERS'
WHERE name = 'Siruvani';

UPDATE meeting_halls 
SET description = 'GANGA MEETING HALL - OCCUPENCY : MINIMUM - 2 MEMBERS MAXIMUM - 5 MEMBERS'
WHERE name = 'Ganga';

UPDATE meeting_halls 
SET description = 'ANANTA MEETING HALL - OCCUPENCY : MINIMUM - 2 MEMBERS MAXIMUM - 5 MEMBERS'
WHERE name = 'Ananta';

UPDATE meeting_halls 
SET description = 'VICHITRAM MEETING HALL - OCCUPENCY : MINIMUM - 5 MEMBERS MAXIMUM - 12 MEMBERS'
WHERE name = 'Vichitram';
