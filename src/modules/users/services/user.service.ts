import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IUserRepository } from "../repositories/user.repository";
import type {
  User,
  RegisterInput,
  LoginInput,
  UserProfileUpdate,
  UserPreferences,
} from "../schemas/user.schema";
import type { EventBus } from "@/lib/events/event-bus";
import type { UserRegisteredEvent, UserProfileUpdatedEvent } from "../events/user.events";

export class UserService {
  constructor(
    private userRepo: IUserRepository,
    private eventBus?: EventBus
  ) {}

  /**
   * Регистрирует нового пользователя.
   */
  async register(input: RegisterInput): Promise<{ user: User; token: string }> {
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

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const createData: Parameters<IUserRepository["create"]>[0] = {
      email: input.email,
      username: input.username,
      password: hashedPassword,
    };

    if (input.displayName !== null && input.displayName !== undefined) {
      createData.displayName = input.displayName;
    }

    const user = await this.userRepo.create(createData);
    const token = this.generateJWT(user);

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
   */
  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    const authUser = input.email
      ? await this.userRepo.findByEmail(input.email)
      : await this.userRepo.findByUsername(input.username!);

    if (!authUser) {
      const error = new Error("User not found");
      (error as any).status = 404;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(input.password, authUser.passwordHash);

    if (!isValidPassword) {
      const error = new Error("Invalid credentials");
      (error as any).status = 401;
      throw error;
    }

    const { passwordHash: _omit, ...user } = authUser;
    const token = this.generateJWT(user);

    return { user, token };
  }

  /**
   * Обновляет профиль пользователя.
   */
  async updateProfile(id: string, data: UserProfileUpdate): Promise<User> {
    // Создаем объект обновления, явно указывая типы
    type UpdateData = {
      displayName?: string | null;
      bio?: string | null;
      website?: string | null;
      location?: string | null;
      birthDate?: Date | null;
      preferences?: Partial<UserPreferences>;
    };

    const updateData: UpdateData = {};

    if (data.displayName !== undefined) {
      updateData.displayName = data.displayName;
    }
    if (data.bio !== undefined) {
      updateData.bio = data.bio;
    }
    if (data.website !== undefined) {
      updateData.website = data.website;
    }
    if (data.location !== undefined) {
      updateData.location = data.location;
    }
    if (data.birthDate !== undefined) {
      updateData.birthDate = data.birthDate;
    }
    if (data.preferences !== undefined) {
      // Приводим к правильному типу
      updateData.preferences = data.preferences as Partial<UserPreferences>;
    }

    const updatedUser = await this.userRepo.update(id, updateData);

    if (this.eventBus && Object.keys(updateData).length > 0) {
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
   * Генерирует JWT токен.
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
