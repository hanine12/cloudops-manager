import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service.js';
import { MonitoringController } from './monitoring.controller.js';

@Module({
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class MonitoringModule {}
