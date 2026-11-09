import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'sara@cloudops.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Sara Ben Ali' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ minLength: 8, example: 'StrongPass123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.VIEWER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}