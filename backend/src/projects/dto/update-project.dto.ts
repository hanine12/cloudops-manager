import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto.js';

// Every field becomes optional, validators are kept.
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}