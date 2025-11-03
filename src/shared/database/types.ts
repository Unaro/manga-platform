import { MergeDeep } from 'type-fest';
import { Database as DatabaseGenerated, Json } from './generated.types';
import { UserPreferences, UserStats } from '@/modules/users/types';

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        users: {
          Row: {
            preferences: UserPreferences; // строго в домене
            stats: UserStats;
          };
          Insert: {
            preferences?: UserPreferences | Json; // разрешим Json для совместимости
            stats?: UserStats | Json;
          };
          Update: {
            preferences?: UserPreferences | Json;
            stats?: UserStats | Json;
          };
        };
      };
    };
  }
>;
