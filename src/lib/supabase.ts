import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined in environment variables. Please check your .env file and restart the server.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined in environment variables. Please check your .env file and restart the server.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to check if error is from Supabase
export const isSupabaseError = (error: unknown): boolean => {
  return error instanceof Error && 'code' in (error as any);
};

// Type-safe fetch function for job postings
export async function fetchJobPostings() {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return { 
      data: null, 
      error: isSupabaseError(error) ? error : new Error('Failed to fetch job postings')
    };
  }
}

// Function to save enquiry submissions
export async function saveEnquiry(enquiry: {
  name: string;
  email: string;
  contact_number: string;
  service: string;
  message?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([enquiry])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving enquiry:', error);
    return { 
      data: null, 
      error: isSupabaseError(error) ? error : new Error('Failed to save enquiry')
    };
  }
}