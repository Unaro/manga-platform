import type { UserPreferences, UserStats } from '@/modules/users/types';
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
          preferences: UserPreferences; // строгий тип вместо Record
          stats: UserStats;             // строгий тип вместо Record
          is_active: boolean;
          email_verified: boolean;
          last_active_at: string | null;
          password: string;
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
          preferences: UserPreferences;
          stats: UserStats;
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
