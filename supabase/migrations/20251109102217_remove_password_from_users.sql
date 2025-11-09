-- Удаляем поле password из public.users (если существует)
ALTER TABLE public.users DROP COLUMN IF EXISTS password;

-- Добавляем foreign key на auth.users (только если не существует)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_id_fkey'
  ) THEN
    ALTER TABLE public.users 
      ADD CONSTRAINT users_id_fkey 
      FOREIGN KEY (id) 
      REFERENCES auth.users(id) 
      ON DELETE CASCADE;
  END IF;
END $$;

COMMENT ON TABLE public.users IS 'User profiles. Passwords stored in auth.users by Supabase Auth.';
