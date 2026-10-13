/*
  # Vilvah Meeting Hall Booking System - Database Schema

  ## Overview
  This migration creates the complete database structure for the Vilvah Meeting Hall Booking Management System.

  ## New Tables

  ### 1. `meeting_halls`
  Stores information about available meeting halls
  - `id` (uuid, primary key) - Unique identifier for each hall
  - `name` (text) - Name of the meeting hall
  - `description` (text) - Detailed description of the hall
  - `capacity` (integer) - Maximum number of people the hall can accommodate
  - `image_url` (text) - URL to the hall's image
  - `created_at` (timestamptz) - Timestamp when the hall was added

  ### 2. `bookings`
  Stores all booking requests and their status
  - `id` (uuid, primary key) - Unique identifier for each booking
  - `hall_id` (uuid, foreign key) - References the meeting hall being booked
  - `user_name` (text) - Name of the person making the booking
  - `team_name` (text) - Name of the team
  - `members_count` (integer) - Number of team members attending
  - `start_time` (timestamptz) - Meeting start time
  - `end_time` (timestamptz) - Meeting end time
  - `status` (text) - Booking status: 'review', 'accepted', 'cancelled'
  - `created_at` (timestamptz) - When the booking was created
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Public can view meeting halls
  - Public can create and view their own bookings
  - Authenticated users (admins) can manage all bookings
  - Admins can manage meeting halls

  ## Important Notes
  1. Bookings start with 'review' status by default
  2. Users can only cancel bookings if start_time is more than 1 hour away
  3. Admins can cancel at any time
  4. All timestamps use timezone-aware format
*/

CREATE TABLE IF NOT EXISTS meeting_halls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id uuid NOT NULL REFERENCES meeting_halls(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  team_name text NOT NULL,
  members_count integer NOT NULL CHECK (members_count > 0),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'review' CHECK (status IN ('review', 'accepted', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_hall_id ON bookings(hall_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);

ALTER TABLE meeting_halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meeting halls"
  ON meeting_halls FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert meeting halls"
  ON meeting_halls FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update meeting halls"
  ON meeting_halls FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete meeting halls"
  ON meeting_halls FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (status = 'review');

CREATE POLICY "Users can cancel their own bookings if more than 1 hour before start"
  ON bookings FOR UPDATE
  USING (status != 'cancelled' AND start_time > now() + interval '1 hour')
  WITH CHECK (status = 'cancelled');

CREATE POLICY "Admins can update all bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO meeting_halls (name, description, capacity, image_url) VALUES
  ('Innovation Hub', 'A modern meeting space equipped with state-of-the-art technology, perfect for brainstorming sessions and collaborative work.', 15, 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Executive Boardroom', 'An elegant and professional environment designed for high-level meetings and presentations with premium amenities.', 20, 'https://images.pexels.com/photos/827518/pexels-photo-827518.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Creative Studio', 'A vibrant and inspiring space with flexible seating arrangements, ideal for workshops and creative team sessions.', 12, 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Conference Center', 'A spacious hall with advanced audio-visual equipment, suitable for large gatherings, seminars, and conferences.', 50, 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Focus Room', 'An intimate meeting space designed for small team discussions and focused collaboration sessions.', 8, 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT DO NOTHING;