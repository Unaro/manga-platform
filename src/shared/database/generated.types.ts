export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      authors: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          created_at: string | null
          external_url: string
          id: string
          number: number
          published_at: string | null
          source_id: string
          title: string | null
          translator_id: string | null
          volume: string | null
          work_id: string
        }
        Insert: {
          created_at?: string | null
          external_url: string
          id?: string
          number: number
          published_at?: string | null
          source_id: string
          title?: string | null
          translator_id?: string | null
          volume?: string | null
          work_id: string
        }
        Update: {
          created_at?: string | null
          external_url?: string
          id?: string
          number?: number
          published_at?: string | null
          source_id?: string
          title?: string | null
          translator_id?: string | null
          volume?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_translator_id_fkey"
            columns: ["translator_id"]
            isOneToOne: false
            referencedRelation: "translators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "work_statistics"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "chapters_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          api_url: string | null
          base_url: string
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          type: string
        }
        Insert: {
          api_url?: string | null
          base_url: string
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          type: string
        }
        Update: {
          api_url?: string | null
          base_url?: string
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          type?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      translators: {
        Row: {
          contacts: Json | null
          created_at: string | null
          id: string
          name: string
          slug: string
          source_id: string
          url: string | null
        }
        Insert: {
          contacts?: Json | null
          created_at?: string | null
          id?: string
          name: string
          slug: string
          source_id: string
          url?: string | null
        }
        Update: {
          contacts?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          source_id?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translators_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          display_name: string | null
          email: string
          email_verified: boolean
          id: string
          is_active: boolean
          last_active_at: string | null
          location: string | null
          preferences: Json
          role: Database["public"]["Enums"]["user_role"]
          stats: Json
          updated_at: string
          username: string
          website: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          email_verified?: boolean
          id: string
          is_active?: boolean
          last_active_at?: string | null
          location?: string | null
          preferences?: Json
          role?: Database["public"]["Enums"]["user_role"]
          stats?: Json
          updated_at?: string
          username: string
          website?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          email_verified?: boolean
          id?: string
          is_active?: boolean
          last_active_at?: string | null
          location?: string | null
          preferences?: Json
          role?: Database["public"]["Enums"]["user_role"]
          stats?: Json
          updated_at?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      work_authors: {
        Row: {
          author_id: string
          order_index: number
          work_id: string
        }
        Insert: {
          author_id: string
          order_index?: number
          work_id: string
        }
        Update: {
          author_id?: string
          order_index?: number
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_authors_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "work_statistics"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "work_authors_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_genres: {
        Row: {
          genre_id: string
          work_id: string
        }
        Insert: {
          genre_id: string
          work_id: string
        }
        Update: {
          genre_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_genres_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "work_statistics"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "work_genres_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_ratings: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          updated_at: string | null
          user_id: string
          work_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          updated_at?: string | null
          user_id: string
          work_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_ratings_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "work_statistics"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "work_ratings_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_sources: {
        Row: {
          created_at: string | null
          external_id: string
          external_rating: number | null
          external_rating_count: number | null
          external_url: string
          id: string
          metadata: Json | null
          source_id: string
          synced_at: string | null
          work_id: string
        }
        Insert: {
          created_at?: string | null
          external_id: string
          external_rating?: number | null
          external_rating_count?: number | null
          external_url: string
          id?: string
          metadata?: Json | null
          source_id: string
          synced_at?: string | null
          work_id: string
        }
        Update: {
          created_at?: string | null
          external_id?: string
          external_rating?: number | null
          external_rating_count?: number | null
          external_url?: string
          id?: string
          metadata?: Json | null
          source_id?: string
          synced_at?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_sources_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "work_statistics"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "work_sources_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_tags: {
        Row: {
          tag_id: string
          work_id: string
        }
        Insert: {
          tag_id: string
          work_id: string
        }
        Update: {
          tag_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_tags_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "work_statistics"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "work_tags_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_views: {
        Row: {
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
          work_id: string
        }
        Insert: {
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
          work_id: string
        }
        Update: {
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_views_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "work_statistics"
            referencedColumns: ["work_id"]
          },
          {
            foreignKeyName: "work_views_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      works: {
        Row: {
          added_by: string
          alternative_titles: Json | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          slug: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          added_by: string
          alternative_titles?: Json | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          slug: string
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          added_by?: string
          alternative_titles?: Json | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          slug?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "works_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      work_statistics: {
        Row: {
          average_rating: number | null
          chapter_count: number | null
          rating_count: number | null
          source_count: number | null
          view_count: number | null
          work_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      refresh_work_statistics: { Args: never; Returns: undefined }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      user_role: "user" | "moderator" | "admin"
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
    Enums: {
      user_role: ["user", "moderator", "admin"],
    },
  },
} as const

