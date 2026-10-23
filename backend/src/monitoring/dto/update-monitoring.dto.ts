import { PartialType } from '@nestjs/mapped-types';
import { CreateMonitoringDto } from './create-monitoring.dto.js';

export class UpdateMonitoringDto extends PartialType(CreateMonitoringDto) {}
