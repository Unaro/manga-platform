import type { DomainEvent } from "@/lib/events/event-bus";
import type { User, UserProfileUpdate } from "../schemas/user.schema";

/**
 * Событие регистрации нового пользователя.
 */
export interface UserRegisteredEvent
  extends DomainEvent<{
    user: Pick<User, "id" | "email" | "username" | "role" | "createdAt">;
  }> {
  type: "user.registered";
}

/**
 * Событие обновления профиля пользователя.
 */
export interface UserProfileUpdatedEvent
  extends DomainEvent<{
    userId: string;
    changes: UserProfileUpdate;
  }> {
  type: "user.profile.updated";
}

/**
 * Событие удаления пользователя.
 */
export interface UserDeletedEvent
  extends DomainEvent<{
    userId: string;
  }> {
  type: "user.deleted";
}

/**
 * Событие подтверждения email.
 */
export interface UserEmailVerifiedEvent
  extends DomainEvent<{
    userId: string;
    email: string;
  }> {
  type: "user.email.verified";
}