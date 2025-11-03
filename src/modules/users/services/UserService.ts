// User Service
import { User, RegisterInput, LoginInput, UserProfileUpdate } from '../types';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async register(data: RegisterInput): Promise<{ user: User; token: string }> {
    // Validate input
    const emailTaken = await this.userRepo.isEmailTaken(data.email);
    if (emailTaken) {
      throw new Error('Email already taken');
    }

    const usernameTaken = await this.userRepo.isUsernameTaken(data.username);
    if (usernameTaken) {
      throw new Error('Username already taken');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await this.userRepo.create({
      ...data,
      hashedPassword,
    });

    // Generate JWT
    const token = await this.generateJWT(user);

    // Emit event
    // TODO: Emit user.registered event

    return { user, token };
  }

  async login(data: LoginInput): Promise<{ user: User; token: string }> {
    // Find user
    const user = data.email
      ? await this.userRepo.findByEmail(data.email)
      : data.username
      ? await this.userRepo.findByUsername(data.username)
      : null;

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const validPassword = await this.verifyPassword(data.password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    // Generate JWT
    const token = await this.generateJWT(user);

    return { user, token };
  }

  async getUserProfile(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async updateProfile(id: string, data: UserProfileUpdate): Promise<User> {
    const user = await this.userRepo.update(id, data);

    // Emit event
    // TODO: Emit user.profile.updated event

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    throw new Error('Not implemented yet');
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    throw new Error('Not implemented yet');
  }

  private async generateJWT(user: User): Promise<string> {
    throw new Error('Not implemented yet');
  }
}
