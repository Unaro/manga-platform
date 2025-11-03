import type { User } from '../types';
import type { UserProfileUpdateDTO } from '../api/dto';

/** Преобразование DTO обновления профиля в доменную структуру. */
export function mapProfileUpdateDtoToDomain(dto: UserProfileUpdateDTO): Partial<Pick<User, 'displayName' | 'bio' | 'website' | 'location' | 'birthDate' | 'preferences'>> {
  return {
    ...(dto.displayName !== undefined && { displayName: dto.displayName }),
    ...(dto.bio !== undefined && { bio: dto.bio }),
    ...(dto.website !== undefined && { website: dto.website }),
    ...(dto.location !== undefined && { location: dto.location }),
    ...(dto.birthDate !== undefined && { birthDate: dto.birthDate }),
    // preferences добавим отдельным endpoint’ом с собственной схемой, чтобы не ломать strict typing
  } as const;
}
