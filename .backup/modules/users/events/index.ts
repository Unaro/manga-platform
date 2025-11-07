import type { User } from '../types';

export type UserRegisteredEvent = {
  type: 'user.registered';
  at: string; // ISO string
  payload: {
    user: Pick<User, 'id' | 'email' | 'username' | 'role' | 'createdAt'>;
  };
};

export type UserProfileUpdatedEvent = {
  type: 'user.profile.updated';
  at: string; // ISO string
  payload: {
    userId: string;
    changes: Partial<Pick<User, 'displayName' | 'bio' | 'website' | 'location' | 'birthDate' | 'preferences'>>;
  };
};

/** Простейшая шина событий в памяти. */
export class InMemoryEventBus {
  private handlers: Record<string, Array<(e: unknown) => Promise<void> | void>> = {};

  subscribe<T = unknown>(type: string, handler: (e: T) => Promise<void> | void) {
    (this.handlers[type] ||= []).push(handler as (e: unknown) => Promise<void> | void);
  }

  async publish<T = unknown>(type: string, event: T) {
    const hs = this.handlers[type];
    if (!hs || hs.length === 0) return;
    for (const h of hs) await h(event);
  }
}

/** Обработчики событий пользователя. */
export class UserEventHandler {
  async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
    // TODO: welcome email, initial balances, achievement
    console.log('User registered:', event.payload.user.id);
  }

  async handleUserProfileUpdated(event: UserProfileUpdatedEvent): Promise<void> {
    // TODO: invalidate cache, update search index
    console.log('User profile updated:', event.payload.userId, Object.keys(event.payload.changes));
  }
}

/** Регистрация обработчиков для типов событий пользователя. */
export function registerUserEventHandlers(eventBus: InMemoryEventBus) {
  const handler = new UserEventHandler();
  eventBus.subscribe<UserRegisteredEvent>('user.registered', (e) => handler.handleUserRegistered(e));
  eventBus.subscribe<UserProfileUpdatedEvent>('user.profile.updated', (e) => handler.handleUserProfileUpdated(e));
}
