import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RegisterInput, LoginInput, UserProfileUpdate } from '../types';
import { UserRepository } from '../repositories/UserRepository';

/**
 * UserService — бизнес-логика работы с пользователями: регистрация, логин, профиль.
 * Комментарии к типам:
 * - Генерация JWT использует минимальный payload (sub, email, username, role).
 * - Пароль хранится только в репозитории/БД, в доменной модели User его нет.
 */
export class UserService {
  constructor(private userRepo: UserRepository) {}

  /**
   * Регистрация нового пользователя.
   * Возвращает доменную модель пользователя и JWT токен.
   */
  async register(input: RegisterInput): Promise<{ user: User; token: string }> {
    // exactOptionalPropertyTypes: гарантия, что displayName не будет undefined
    const data: RegisterInput = {
      email: input.email,
      username: input.username,
      password: input.password,
      ...(input.displayName !== undefined && { displayName: input.displayName }),
    };

    const emailTaken = await this.userRepo.isEmailTaken(data.email);
    if (emailTaken) {
      throw Object.assign(new Error('Email already taken'), { status: 409 });
    }

    const usernameTaken = await this.userRepo.isUsernameTaken(data.username);
    if (usernameTaken) {
      throw Object.assign(new Error('Username already taken'), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userRepo.create({ ...data, hashedPassword });
    const token = this.generateJWT(user);
    return { user, token };
  }

  /**
   * Вход пользователя по email или username и паролю.
   * Возвращает доменную модель пользователя и JWT токен.
   */
  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    const data: LoginInput = {
      ...(input.email !== undefined && { email: input.email }),
      ...(input.username !== undefined && { username: input.username }),
      password: input.password,
    };

    const user = data.email
      ? await this.userRepo.findByEmail(data.email)
      : data.username
      ? await this.userRepo.findByUsername(data.username)
      : null;

    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }

    // Доступ к хешу пароля: временное решение через расширение типа (см. TYPE_USAGE.md)
    // @ts-expect-error password hash доступен только в репозитории; план — ввести тип AuthUser
    const hashed: string | undefined = (user as any).password;
    if (!hashed || !(await bcrypt.compare(data.password, hashed))) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    const token = this.generateJWT(user);
    return { user, token };
  }

  /** Получение профиля пользователя по id. */
  async getUserProfile(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  /** Обновление профиля пользователя. */
  async updateProfile(id: string, data: UserProfileUpdate): Promise<User> {
    const user = await this.userRepo.update(id, data);
    return user;
  }

  /** Генерация JWT с TTL 1h. */
  private generateJWT(user: User): string {
    const payload = { sub: user.id, email: user.email, username: user.username, role: user.role } as const;
    const secret = process.env.JWT_SECRET as string;
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }
}
