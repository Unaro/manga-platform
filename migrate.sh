#!/bin/bash

echo "��� Starting migration to new architecture..."

# 1. Резервное копирование старых файлов
echo "��� Creating backup..."
mkdir -p .backup/modules
cp -r src/modules/users .backup/modules/

# 2. Удаление старых файлов
echo "���️  Removing old files..."
rm -rf src/modules/users/api/auth
rm -f src/modules/users/api/dto.ts
rm -f src/modules/users/api/mappers.ts
rm -f src/modules/users/api/index.ts
rm -f src/modules/users/types/index.ts
rm -f src/modules/users/events/index.ts

# 3. Создание новой структуры
echo "��� Creating new structure..."
mkdir -p src/modules/users/{schemas,hooks}
mkdir -p src/lib/{events,api,supabase}
mkdir -p src/components/auth
mkdir -p src/app/api/auth/{register,login}
mkdir -p src/app/api/users/[id]

echo "✅ Migration preparation complete!"
echo "��� Next steps:"
echo "   1. Run: npm run typecheck"
echo "   2. Run: npm run lint"
echo "   3. Test API endpoints"
echo "   4. Run tests: npm test"
