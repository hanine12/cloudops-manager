import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';

// Every field of CreateUserDto becomes optional (validators are kept).
export class UpdateUserDto extends PartialType(CreateUserDto) {}