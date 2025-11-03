import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types';
import { UserRepository } from '../repositories/UserRepository';
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';
import type { RegisterInputDTO, LoginInputDTO, UserProfileUpdateDTO } from '../api/dto';
import { mapProfileUpdateDtoToDomain } from '../api/mappers';
import type { InMemoryEventBus, UserRegisteredEvent, UserProfileUpdatedEvent } from '../events';

export class UserService {
  constructor(
    private userRepo: UserRepository & Pick<SupabaseUserRepository, 'findByEmail' | 'findByUsername'>,
    private eventBus?: InMemoryEventBus
  ) {}

  /** Регистрирует нового пользователя с хешированием пароля и генерацией JWT токена. */
  async register(input: RegisterInputDTO): Promise<{ user: User; token: string }> {
    const data = {
      email: input.email,
      username: input.username,
      password: input.password,
      ...(input.displayName !== null && input.displayName !== undefined && { displayName: input.displayName })
    } as const;

    if (await this.userRepo.isEmailTaken(data.email)) {
      throw Object.assign(new Error('Email already taken'), { status: 409 });
    }
    if (await this.userRepo.isUsernameTaken(data.username)) {
      throw Object.assign(new Error('Username already taken'), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userRepo.create({ ...data, password: hashedPassword });
    const token = this.generateJWT(user);

    // Публикуем событие регистрации пользователя
    if (this.eventBus) {
      const event: UserRegisteredEvent = {
        type: 'user.registered',
        at: new Date().toISOString(),
        payload: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
      };
      await this.eventBus.publish('user.registered', event);
    }

    return { user, token };
  }

  /** Аутентификация пользователя по email или username с проверкой пароля. */
  async login(input: LoginInputDTO): Promise<{ user: User; token: string }> {
    const data = {
      password: input.password,
      ...(input.email !== undefined && { email: input.email }),
      ...(input.username !== undefined && { username: input.username })
    } as const;

    const repo = this.userRepo as SupabaseUserRepository;
    const authUser = 'email' in data
      ? await repo.findByEmail(data.email)
      : await repo.findByUsername(data.username!);

    if (!authUser) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }

    if (!(await bcrypt.compare(data.password, authUser.passwordHash))) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    const token = this.generateJWT(authUser);
    const { passwordHash: _omit, ...user } = authUser;
    return { user, token } as { user: User; token: string };
  }

  /** Обновляет профиль пользователя и публикует событие изменения. */
  async updateProfile(id: string, dto: UserProfileUpdateDTO): Promise<User> {
    const domain = mapProfileUpdateDtoToDomain(dto);
    const updatedUser = await this.userRepo.update(id, domain);

    // Публикуем событие обновления профиля
    if (this.eventBus && Object.keys(domain).length > 0) {
      const event: UserProfileUpdatedEvent = {
        type: 'user.profile.updated',
        at: new Date().toISOString(),
        payload: {
          userId: id,
          changes: domain,
        },
      };
      await this.eventBus.publish('user.profile.updated', event);
    }

    return updatedUser;
  }

  /** Генерирует JWT токен для аутентифицированного пользователя. */
  private generateJWT(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    } as const;
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }
}
