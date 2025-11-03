# Type Usage Report

Обновлено: заменены на автогенерируемые Supabase типы, убраны любые приведения типов.

## Убраны any
- supabaseClient.ts: использует сгенерированный Database тип из generated.types.ts.
- UserService.login: убран (user as any).password; введён AuthUser тип.
- SupabaseUserRepository: убраны все as Record<string, unknown> и as any; вместо них типобезопасные парсеры JSONB → домен.

## unknown под контролем
- Обработка ошибок: нормализуется через { message?: string; status?: number }. План: вынести в shared/errors с type guard.
- JSONB парсинг: parsePreferences/parseStats используют unknown → строгие типы через type guards. Это безопасно и корректно.

## undefined исключены
- exactOptionalPropertyTypes: все DTO и Update объекты собираются условными спредами без undefined ключей.
- null-политика: доменные типы используют null для отсутствующих значений, не undefined.

## Автогенерация Supabase
- Database, Tables, TablesInsert, TablesUpdate — из Supabase CLI.
- JSONB поля (preferences/stats) остаются как Json на уровне БД, парсятся в строгие доменные типы в репозитории.
- Никаких ручных Database определений или циркулярных импортов.

## Статус
✅ Все приведения типов убраны
✅ Строгие парсеры JSONB → домен  
✅ Официальная Supabase типизация
✅ exactOptionalPropertyTypes соблюдена
