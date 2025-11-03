# Type Usage Report

Обновлено: добавлены типы Database и тип AuthUser, удалены временные any/@ts-expect-error.

## Убраны any
- supabaseClient.ts: `SupabaseClient<Database>` вместо any.
- UserService.login: убрано `(user as any).password`; введён тип `AuthUser` и методы репозитория возвращают `passwordHash` для ветки аутентификации.

## unknown
- Обработка ошибок по-прежнему принимает `unknown`, нормализуется до `{ message?: string; status?: number }`. План: вынести нормализатор в `shared/errors` и использовать type guard.

## undefined
- Политика null: доменная модель `User` использует `null` для отсутствующих значений. Входные данные в auth-роуте собираются условными спредами, исключая undefined-ключи.
