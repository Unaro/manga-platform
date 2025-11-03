import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RegisterInput, LoginInput, UserProfileUpdate } from '../types';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async register(data: RegisterInput): Promise<{ user: User; token: string }> {
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

  async login(data: LoginInput): Promise<{ user: User; token: string }> {
    const user = data.email
      ? await this.userRepo.findByEmail(data.email)
      : data.username
      ? await this.userRepo.findByUsername(data.username!)
      : null;

    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }

    // @ts-expect-error password hash is stored only in repository layer mapping
    const hashed: string | undefined = (user as any).password;
    if (!hashed || !(await bcrypt.compare(data.password, hashed))) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    const token = this.generateJWT(user);
    return { user, token };
  }

  async getUserProfile(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async updateProfile(id: string, data: UserProfileUpdate): Promise<User> {
    const user = await this.userRepo.update(id, data);
    return user;
  }

  private generateJWT(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const secret = process.env.JWT_SECRET as string;
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }
}
