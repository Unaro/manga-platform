## Типовые изменения (комментарий к коммиту)

- Обновлены Database типы: `preferences: UserPreferences`, `stats: UserStats`.
- Репозиторий: добавлены `defaultPreferences/defaultStats` и парсеры `parsePreferences/parseStats` для безопасного JSONB → домен.
- Создан `users/api/dto.ts` с DTO и Zod-схемами.
- Обновлены импорты сервисов/роутов на DTO.
- Убраны приведения `as Record<string, unknown>` и несоответствия типов.

ПРИМЕЧАНИЕ про any: временного any не добавлено. В одном месте `updateProfile` содержит `as any` для адаптера DTO→домен — это временное место до добавления полноценного маппера (будет устранено в следующем шаге и отражено в TYPE_USAGE.md).
