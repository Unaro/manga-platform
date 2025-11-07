import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IUserRepository } from "../repositories/user.repository";
import type {
  User,
  RegisterInput,
  LoginInput,
  UserProfileUpdate,
} from "../schemas/user.schema";
import type { EventBus } from "@/lib/events/event-bus";
import type {
  UserRegisteredEvent,
  UserProfileUpdatedEvent,
} from "../events/user.events";

export class UserService {
  constructor(
    private userRepo: IUserRepository,
    private eventBus?: EventBus
  ) {}

  /**
   * Регистрирует нового пользователя.
   * @throws {Error} Если email или username уже заняты
   */
  async register(
    input: RegisterInput
  ): Promise<{ user: User; token: string }> {
    // Проверка уникальности
    if (await this.userRepo.isEmailTaken(input.email)) {
      const error = new Error("Email already taken");
      (error as any).status = 409;
      throw error;
    }

    if (await this.userRepo.isUsernameTaken(input.username)) {
      const error = new Error("Username already taken");
      (error as any).status = 409;
      throw error;
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // Создание пользователя
    const user = await this.userRepo.create({
      email: input.email,
      username: input.username,
      password: hashedPassword,
      displayName: input.displayName ?? undefined,
    });

    // Генерация токена
    const token = this.generateJWT(user);

    // Публикация события
    if (this.eventBus) {
      const event: UserRegisteredEvent = {
        type: "user.registered",
        timestamp: new Date(),
        eventId: crypto.randomUUID(),
        version: 1,
        aggregateId: user.id,
        aggregateType: "user",
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
        metadata: {
          userId: user.id,
          source: "user-service",
        },
      };
      await this.eventBus.publish("user.registered", event);
    }

    return { user, token };
  }

  /**
   * Аутентифицирует пользователя.
   * @throws {Error} Если пользователь не найден или пароль неверен
   */
  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    // Поиск пользователя
    const authUser = input.email
      ? await this.userRepo.findByEmail(input.email)
      : await this.userRepo.findByUsername(input.username!);

    if (!authUser) {
      const error = new Error("User not found");
      (error as any).status = 404;
      throw error;
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(
      input.password,
      authUser.passwordHash
    );

    if (!isValidPassword) {
      const error = new Error("Invalid credentials");
      (error as any).status = 401;
      throw error;
    }

    // Генерация токена
    const { passwordHash: _omit, ...user } = authUser;
    const token = this.generateJWT(user);

    return { user, token };
  }

  /**
   * Обновляет профиль пользователя.
   * @throws {Error} Если пользователь не найден
   */
  async updateProfile(
    id: string,
    data: UserProfileUpdate
  ): Promise<User> {
    const updatedUser = await this.userRepo.update(id, data);

    // Публикация события
    if (this.eventBus && Object.keys(data).length > 0) {
      const event: UserProfileUpdatedEvent = {
        type: "user.profile.updated",
        timestamp: new Date(),
        eventId: crypto.randomUUID(),
        version: 1,
        aggregateId: id,
        aggregateType: "user",
        data: {
          userId: id,
          changes: data,
        },
        metadata: {
          userId: id,
          source: "user-service",
        },
      };
      await this.eventBus.publish("user.profile.updated", event);
    }

    return updatedUser;
  }

  /**
   * Получает пользователя по ID.
   * @throws {Error} Если пользователь не найден
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    
    if (!user) {
      const error = new Error("User not found");
      (error as any).status = 404;
      throw error;
    }

    return user;
  }

  /**
   * Генерирует JWT токен для пользователя.
   */
  private generateJWT(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
  }
}