import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ServersModule } from './servers/servers.module.js';
import { ApplicationsModule } from './applications/applications.module.js';
import { MonitoringModule } from './monitoring/monitoring.module.js';
import { AlertsModule } from './alerts/alerts.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    ServersModule,
    ApplicationsModule,
    MonitoringModule,
    AlertsModule,
  ],
})
export class AppModule {}