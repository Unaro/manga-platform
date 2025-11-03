// Users domain types with strict structure and JSDoc

/** Роль пользователя в системе. */
export type UserRole = 'user' | 'moderator' | 'admin';

/** Настройки уведомлений пользователя (каналы и типы событий). */
export interface NotificationSettings {
  /** Разрешены ли email-уведомления. */
  email: boolean;
  /** Разрешены ли браузерные пуш-уведомления. */
  browser: boolean;
  /** Разрешены ли уведомления в расширении. */
  extension: boolean;
  /** Уведомления о новых главах. */
  newChapters: boolean;
  /** Уведомления о получении карточек. */
  cardReceived: boolean;
  /** Уведомления о достижениях. */
  achievements: boolean;
  /** Уведомления о заявках на обмен. */
  tradeRequests: boolean;
  /** Уведомления об обновлениях аукционов. */
  auctionUpdates: boolean;
}

/** Предпочтения пользователя (локаль, тема, приватность, уведомления). */
export interface UserPreferences {
  /** Язык интерфейса (например, 'ru', 'en'). */
  language: string;
  /** Часовой пояс в формате IANA (например, 'Asia/Almaty'). */
  timezone: string;
  /** Тема интерфейса. */
  theme: 'light' | 'dark' | 'auto';
  /** Компактный режим интерфейса. */
  compactMode: boolean;
  /** Публичность профиля. */
  profilePublic: boolean;
  /** Показывать email другим пользователям. */
  showEmail: boolean;
  /** Показывать статистику в профиле. */
  showStats: boolean;
  /** Настройки уведомлений. */
  notifications: NotificationSettings;
}

/** Статистика пользователя (чтение, игра, коллекции). */
export interface UserStats {
  /** Кол-во произведений, которые пользователь читал. */
  totalWorksRead: number;
  /** Кол-во прочитанных глав. */
  totalChaptersRead: number;
  /** Общее время чтения (минуты). */
  totalReadingTime: number;
  /** Средняя оценка пользователя. */
  averageRating: number;
  /** Уровень пользователя. */
  level: number;
  /** Опыт пользователя. */
  experience: number;
  /** Баланс монет (deprecated, будет в UserBalance). */
  currency: number;
  /** Общее кол-во карточек. */
  totalCards: number;
  /** Кол-во уникальных карточек. */
  uniqueCards: number;
  /** Кол-во редких карточек. */
  rareCards: number;
  /** Разблокированные достижения. */
  achievementsUnlocked: number;
  /** Завершённые сделки. */
  tradesCompleted: number;
  /** Выигранные аукционы. */
  auctionsWon: number;
}

/** Пользователь платформы (доменная модель). */
export interface User {
  /** Идентификатор пользователя. */
  id: string;
  /** Email (уникальный). */
  email: string;
  /** Имя пользователя (уникальный username). */
  username: string;
  /** Отображаемое имя (null, если не задано). */
  displayName: string | null;
  /** URL аватара или null. */
  avatar: string | null;
  /** Роль пользователя. */
  role: UserRole;
  /** Биография (markdown/текст) или null. */
  bio: string | null;
  /** Сайт пользователя или null. */
  website: string | null;
  /** Местоположение или null. */
  location: string | null;
  /** Дата рождения или null. */
  birthDate: Date | null;
  /** Предпочтения пользователя (строгая структура). */
  preferences: UserPreferences;
  /** Статистика пользователя (строгая структура). */
  stats: UserStats;
  /** Активен ли аккаунт. */
  isActive: boolean;
  /** Подтверждён ли email. */
  emailVerified: boolean;
  /** Момент последней активности или null. */
  lastActiveAt: Date | null;
  /** Дата создания записи. */
  createdAt: Date;
  /** Дата последнего обновления записи. */
  updatedAt: Date;
}
