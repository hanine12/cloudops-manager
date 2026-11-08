import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    // role is NOT taken from the request: new users are always VIEWER
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, passwordHash },
    });
    return this.sign(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    const ok = user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!user || !ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user);
  }

  me(userId: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  private sign(user: { id: number; email: string; name: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}