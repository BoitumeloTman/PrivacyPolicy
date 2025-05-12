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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          role: 'employee' | 'student' | 'employer' | 'admin' | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: 'employee' | 'student' | 'employer' | 'admin' | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: 'employee' | 'student' | 'employer' | 'admin' | null
        }
      }
      payslips: {
        Row: {
          id: string
          created_at: string
          user_id: string
          month: string
          year: number
          amount: number
          document_url: string | null
          status: 'pending' | 'approved' | 'paid'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          month: string
          year: number
          amount: number
          document_url?: string | null
          status?: 'pending' | 'approved' | 'paid'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          month?: string
          year?: number
          amount?: number
          document_url?: string | null
          status?: 'pending' | 'approved' | 'paid'
        }
      }
      leave_applications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          start_date: string
          end_date: string
          reason: string
          status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          start_date: string
          end_date: string
          reason: string
          status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          start_date?: string
          end_date?: string
          reason?: string
          status?: 'pending' | 'approved' | 'rejected'
        }
      }
      livestock: {
        Row: {
          id: string
          created_at: string
          tag_number: string
          nickname: string | null
          status: 'healthy' | 'sick' | 'missing' | 'deceased'
          image_url: string | null
          last_dosed: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tag_number: string
          nickname?: string | null
          status?: 'healthy' | 'sick' | 'missing' | 'deceased'
          image_url?: string | null
          last_dosed?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tag_number?: string
          nickname?: string | null
          status?: 'healthy' | 'sick' | 'missing' | 'deceased'
          image_url?: string | null
          last_dosed?: string | null
        }
      }
      treatments: {
        Row: {
          id: string
          created_at: string
          livestock_id: string
          symptoms: string[]
          diagnosis: string
          treatment: string
          date_treated: string
        }
        Insert: {
          id?: string
          created_at?: string
          livestock_id: string
          symptoms: string[]
          diagnosis: string
          treatment: string
          date_treated: string
        }
        Update: {
          id?: string
          created_at?: string
          livestock_id?: string
          symptoms?: string[]
          diagnosis?: string
          treatment?: string
          date_treated?: string
        }
      }
      diseases: {
        Row: {
          id: string
          name: string
          symptoms: string[]
          treatment: string
          prevention: string
        }
        Insert: {
          id?: string
          name: string
          symptoms: string[]
          treatment: string
          prevention: string
        }
        Update: {
          id?: string
          name?: string
          symptoms?: string[]
          treatment?: string
          prevention?: string
        }
      }
      student_timetables: {
        Row: {
          id: string
          user_id: string
          document_url: string | null
          timetable_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_url?: string | null
          timetable_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_url?: string | null
          timetable_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      cooking_schedule: {
        Row: {
          id: string
          created_at: string
          user_id: string
          date: string
          meal: 'breakfast' | 'lunch' | 'dinner'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          date: string
          meal: 'breakfast' | 'lunch' | 'dinner'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          date?: string
          meal?: 'breakfast' | 'lunch' | 'dinner'
        }
      }
    }
  }
}