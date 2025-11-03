import { UserRegisteredEvent, UserProfileUpdatedEvent } from '../types';

export class UserEventHandler {
  async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
    // TODO: welcome email, initial balances, achievement
    console.log('User registered:', event);
  }

  async handleUserProfileUpdated(event: UserProfileUpdatedEvent): Promise<void> {
    // TODO: invalidate cache, update search index
    console.log('User profile updated:', event);
  }
}

export function registerUserEventHandlers(eventBus: {
  subscribe: (type: string, handler: (e: unknown) => Promise<void>) => void;
}) {
  const handler = new UserEventHandler();
  eventBus.subscribe('user.registered', (e) => handler.handleUserRegistered(e as UserRegisteredEvent));
  eventBus.subscribe('user.profile.updated', (e) => handler.handleUserProfileUpdated(e as UserProfileUpdatedEvent));
}
