# Type Usage Report

This repository follows a zero-any policy. All occurrences of `any`/`unknown`/`undefined` below являются временными и помечены с пояснениями и планом замены.

## any

1) File: src/shared/database/supabaseClient.ts
```ts
export type DB = any; // PLACEHOLDER: нет сгенерированных типов Supabase. 
// ЗАМЕНА: сгенерировать типы через `supabase gen types typescript --project-id <id>` 
// и заменить на `export type DB = Database` + типизированный клиент.
```

2) File: src/modules/users/services/UserService.ts
```ts
// @ts-expect-error password hash is stored only in repository layer mapping
const hashed: string | undefined = (user as any).password; 
// ПОЧЕМУ: доменная модель User преднамеренно не содержит password.
// ЗАМЕНА: расширить возвращаемый тип репозитория для login-ветки:
// `findByEmail/Username` возвращают `User & { passwordHash: string }` (или отдельный тип AuthUser),
// убрать приведение к any и @ts-expect-error.
```

## unknown

1) File: src/modules/users/api/auth/route.ts
```ts
} catch (e: unknown) {
  const err = e as { message: string; status?: number };
```
ПОЧЕМУ: тип исключений неизвестен из внешних библиотек; `unknown` безопаснее, чем `any`.
УЛУЧШЕНИЕ: ввести нормализатор ошибок (type guard) и централизованный маппер в `shared/errors`.

## undefined

Политика: избегаем `undefined` в доменных моделях и API. Используем `null` при необходимости пустого значения.
Исключения сейчас:
- Маппинг опциональных полей в `SupabaseUserRepository.mapRowToDomain` возвращает `undefined` для отсутствующих значений (displayName, avatar, ...).
ПЛАН: вернуть `null` вместо `undefined` в доменной модели User или строго зафиксировать, что опциональные поля опущены (используем conditional spread). Рекомендуется унифицировать: хранить `null` в БД и возвращать `null` в API для пустых значений.
