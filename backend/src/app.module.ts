import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ServersModule } from './servers/servers.module.js';
import { ApplicationsModule } from './applications/applications.module.js';
import { MonitoringModule } from './monitoring/monitoring.module.js';
import { AlertsModule } from './alerts/alerts.module.js';
import { ObserveModule } from './observe.js';

@Module({
  imports: [
    ObserveModule.forRoot({ serviceId: 'backend' }),
    PrismaModule,
    UsersModule,
    ProjectsModule,
    ServersModule,
    ApplicationsModule,
    MonitoringModule,
    AlertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}