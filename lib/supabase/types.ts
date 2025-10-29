export interface Database {
  public: {
    Tables: {
      onboarding_experiences: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_screens: {
        Row: {
          id: string
          experience_id: string
          name: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          name: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          name?: string
          order_index?: number
          created_at?: string
        }
      }
      onboarding_components: {
        Row: {
          id: string
          screen_id: string
          type: 'heading' | 'paragraph' | 'image' | 'gif' | 'video' | 'link'
          content: any // JSONB
          settings: any // JSONB
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          screen_id: string
          type: 'heading' | 'paragraph' | 'image' | 'gif' | 'video' | 'link'
          content: any
          settings: any
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          screen_id?: string
          type?: 'heading' | 'paragraph' | 'image' | 'gif' | 'video' | 'link'
          content?: any
          settings?: any
          order_index?: number
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
