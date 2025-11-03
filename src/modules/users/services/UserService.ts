import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RegisterInput, LoginInput, UserProfileUpdate } from '../types';
import { UserRepository } from '../repositories/UserRepository';
import { SupabaseUserRepository, AuthUser } from '../repositories/SupabaseUserRepository';

export class UserService {
  constructor(private userRepo: UserRepository & Pick<SupabaseUserRepository, 'findByEmail' | 'findByUsername'>) {}

  async register(input: RegisterInput): Promise<{ user: User; token: string }> {
    const data: RegisterInput = {
      email: input.email,
      username: input.username,
      password: input.password,
      ...(input.displayName !== undefined && { displayName: input.displayName }),
    };

    const emailTaken = await this.userRepo.isEmailTaken(data.email);
    if (emailTaken) throw Object.assign(new Error('Email already taken'), { status: 409 });

    const usernameTaken = await this.userRepo.isUsernameTaken(data.username);
    if (usernameTaken) throw Object.assign(new Error('Username already taken'), { status: 409 });

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userRepo.create({ ...data, hashedPassword });
    const token = this.generateJWT(user);
    return { user, token };
  }

  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    const data: LoginInput = {
      password: input.password,
      ...(input.email !== undefined && { email: input.email }),
      ...(input.username !== undefined && { username: input.username }),
    };

    let authUser: AuthUser | null = null;
    if ('email' in data) authUser = await (this.userRepo as SupabaseUserRepository).findByEmail(data.email!);
    else if ('username' in data) authUser = await (this.userRepo as SupabaseUserRepository).findByUsername(data.username!);

    if (!authUser) throw Object.assign(new Error('User not found'), { status: 404 });

    const valid = await bcrypt.compare(data.password, authUser.passwordHash);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const token = this.generateJWT(authUser);
    const { passwordHash: _omit, ...user } = authUser;
    return { user, token } as { user: User; token: string };
  }

  async getUserProfile(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async updateProfile(id: string, data: UserProfileUpdate): Promise<User> {
    const user = await this.userRepo.update(id, data);
    return user;
  }

  private generateJWT(user: User): string {
    const payload = { sub: user.id, email: user.email, username: user.username, role: user.role } as const;
    const secret = process.env.JWT_SECRET as string;
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }
}
