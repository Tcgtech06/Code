export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      positions: {
        Row: {
          id: string
          title: string
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          created_at?: string | null
        }
      }
      job_postings: {
        Row: {
          id: string
          title: string
          location: string
          type: string
          description: string
          position_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          location: string
          type: string
          description: string
          position_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          location?: string
          type?: string
          description?: string
          position_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      enquiries: {
        Row: {
          id: string
          name: string
          email: string
          contact_number: string
          service: string
          message: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          contact_number: string
          service: string
          message?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          contact_number?: string
          service?: string
          message?: string | null
          created_at?: string | null
        }
      }
    }
  }
}