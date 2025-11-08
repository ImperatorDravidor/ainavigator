// Database types for Supabase
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
      demo_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          role: string
          company_id: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          role: string
          company_id: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          role?: string
          company_id?: string
          created_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          display_name: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      sentiment_responses: {
        Row: {
          id: string
          response_id: string
          sentiment_level: number
          sentiment_reason: string
          region: string
          department: string
          role: string
          age_group: string | null
          business_unit: string | null
          created_at: string
          session_id: string
        }
        Insert: {
          id?: string
          response_id: string
          sentiment_level: number
          sentiment_reason: string
          region: string
          department: string
          role: string
          age_group?: string | null
          business_unit?: string | null
          created_at?: string
          session_id: string
        }
        Update: {
          id?: string
          response_id?: string
          sentiment_level?: number
          sentiment_reason?: string
          region?: string
          department?: string
          role?: string
          age_group?: string | null
          business_unit?: string | null
          created_at?: string
          session_id?: string
        }
      }
      capability_responses: {
        Row: {
          id: string
          response_id: string
          dimension_scores: Json
          open_feedback: string
          region: string
          function: string
          age_group: string | null
          business_unit: string | null
          created_at: string
          session_id: string
        }
        Insert: {
          id?: string
          response_id: string
          dimension_scores: Json
          open_feedback: string
          region: string
          function: string
          age_group?: string | null
          business_unit?: string | null
          created_at?: string
          session_id: string
        }
        Update: {
          id?: string
          response_id?: string
          dimension_scores?: Json
          open_feedback?: string
          region?: string
          function?: string
          age_group?: string | null
          business_unit?: string | null
          created_at?: string
          session_id?: string
        }
      }
      sessions: {
        Row: {
          id: string
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          metadata?: Json | null
        }
      }
      benchmarks: {
        Row: {
          id: string
          industry: string
          region: string
          sentiment_data: Json
          capability_data: Json
          updated_at: string
        }
        Insert: {
          id?: string
          industry: string
          region: string
          sentiment_data: Json
          capability_data: Json
          updated_at?: string
        }
        Update: {
          id?: string
          industry?: string
          region?: string
          sentiment_data?: Json
          capability_data?: Json
          updated_at?: string
        }
      }
      interventions: {
        Row: {
          id: string
          title: string
          description: string
          full_description: string
          impact_area: string
          target_dimensions: Json | null
          target_constructs: Json | null
          target_sentiment_areas: Json | null
          roi_estimate: Json
          priority: string
          implementation: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          full_description: string
          impact_area: string
          target_dimensions?: Json | null
          target_constructs?: Json | null
          target_sentiment_areas?: Json | null
          roi_estimate: Json
          priority: string
          implementation: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          full_description?: string
          impact_area?: string
          target_dimensions?: Json | null
          target_constructs?: Json | null
          target_sentiment_areas?: Json | null
          roi_estimate?: Json
          priority?: string
          implementation?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
