export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          id: string
          offer_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          offer_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          offer_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      flyer_pages: {
        Row: {
          created_at: string | null
          file_url: string
          flyer_upload_id: string
          id: string
          original_file_name: string | null
          page_number: number
        }
        Insert: {
          created_at?: string | null
          file_url: string
          flyer_upload_id: string
          id?: string
          original_file_name?: string | null
          page_number: number
        }
        Update: {
          created_at?: string | null
          file_url?: string
          flyer_upload_id?: string
          id?: string
          original_file_name?: string | null
          page_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "flyer_pages_flyer_upload_id_fkey"
            columns: ["flyer_upload_id"]
            isOneToOne: false
            referencedRelation: "flyer_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      flyer_uploads: {
        Row: {
          city: string | null
          created_at: string | null
          error_message: string | null
          file_url: string
          id: string
          original_file_name: string | null
          processed_at: string | null
          state: string | null
          status: string | null
          store_name: string
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          error_message?: string | null
          file_url: string
          id?: string
          original_file_name?: string | null
          processed_at?: string | null
          state?: string | null
          status?: string | null
          store_name: string
        }
        Update: {
          city?: string | null
          created_at?: string | null
          error_message?: string | null
          file_url?: string
          id?: string
          original_file_name?: string | null
          processed_at?: string | null
          state?: string | null
          status?: string | null
          store_name?: string
        }
        Relationships: []
      }
      flyers: {
        Row: {
          created_at: string | null
          end_date: string | null
          file_url: string | null
          id: string
          source_url: string | null
          start_date: string | null
          store_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          file_url?: string | null
          id?: string
          source_url?: string | null
          start_date?: string | null
          store_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          file_url?: string | null
          id?: string
          source_url?: string | null
          start_date?: string | null
          store_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "flyers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          category: string | null
          city: string | null
          created_at: string | null
          district: string | null
          fee: number | null
          flyer_upload_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          page_number: number | null
          price: number | null
          product_name: string | null
          source_type: string | null
          store_name: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          district?: string | null
          fee?: number | null
          flyer_upload_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          page_number?: number | null
          price?: number | null
          product_name?: string | null
          source_type?: string | null
          store_name?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          district?: string | null
          fee?: number | null
          flyer_upload_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          page_number?: number | null
          price?: number | null
          product_name?: string | null
          source_type?: string | null
          store_name?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string | null
          default_unit: string | null
          id: string
          normalized_name: string
          subcategory: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string | null
          default_unit?: string | null
          id?: string
          normalized_name: string
          subcategory?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string | null
          default_unit?: string | null
          id?: string
          normalized_name?: string
          subcategory?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          state: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          state?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
