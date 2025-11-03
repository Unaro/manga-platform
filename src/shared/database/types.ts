// Minimal Database types for Supabase (users table only)
export type UUID = string;

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: UUID;
          created_at: string;
          updated_at: string;
          email: string;
          username: string;
          display_name: string | null;
          avatar: string | null;
          role: 'user' | 'moderator' | 'admin';
          bio: string | null;
          website: string | null;
          location: string | null;
          birth_date: string | null;
          preferences: Record<string, unknown>;
          stats: Record<string, unknown>;
          is_active: boolean;
          email_verified: boolean;
          last_active_at: string | null;
          password: string; // hash stored in DB
        };
        Insert: {
          email: string;
          username: string;
          display_name: string | null;
          avatar: string | null;
          role: 'user' | 'moderator' | 'admin';
          bio: string | null;
          website: string | null;
          location: string | null;
          birth_date: string | null;
          preferences: Record<string, unknown>;
          stats: Record<string, unknown>;
          is_active: boolean;
          email_verified: boolean;
          last_active_at: string | null;
          password: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
  };
}
