import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

// Never return passwordHash to the client.
const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      return await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          role: dto.role, // undefined → Prisma default (VIEWER)
          passwordHash,
        },
        select: userSelect,
      });
    } catch (error) {
      throw this.mapError(error);
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      select: userSelect,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id); // 404 if it does not exist

    const { password, ...rest } = dto;
    const data: Prisma.UserUpdateInput = { ...rest };
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: userSelect,
      });
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id); // 404 if it does not exist
    await this.prisma.user.delete({ where: { id } });
    return { message: `User ${id} deleted` };
  }

  // Prisma P2002 = unique constraint violation (email already used).
  private mapError(error: unknown): unknown {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return new ConflictException('Email already in use');
    }
    return error;
  }
}