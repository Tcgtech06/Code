import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MeetingHall {
  id: string;
  name: string;
  description: string;
  capacity: number;
  minimum_capacity: number;
  image_url: string; // Legacy
  image_urls?: string[]; // New multiple images support
  created_at: string;
}

export interface Booking {
  id: string;
  hall_id: string;
  user_name: string;
  user_email?: string;
  team_name: string;
  members_count: number;
  start_time: string;
  end_time: string;
  status: 'review' | 'accepted' | 'cancelled';
  remarks?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
