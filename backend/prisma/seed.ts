import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// random decimal number between min and max
const rand = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

async function main() {
  // 1. Empty the tables (children first), so the seed can be run many times
  await prisma.alert.deleteMany();
  await prisma.alertRule.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.application.deleteMany();
  await prisma.environment.deleteMany();
  await prisma.server.deleteMany();
  await prisma.projectAssignment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users (one per role). Password for all: Password123!
  const passwordHash = await bcrypt.hash('Password123!', 10);
  await prisma.user.createMany({
    data: [
      { email: 'admin@cloudops.com', name: 'Admin User', role: 'ADMIN', passwordHash },
      { email: 'devops@cloudops.com', name: 'DevOps User', role: 'DEVOPS', passwordHash },
      { email: 'viewer@cloudops.com', name: 'Viewer User', role: 'VIEWER', passwordHash },
    ],
  });
  const devops = await prisma.user.findUniqueOrThrow({
    where: { email: 'devops@cloudops.com' },
  });

  // 3. Team
  const team = await prisma.team.create({ data: { name: 'Platform Team' } });
  await prisma.teamMember.create({
    data: { userId: devops.id, teamId: team.id, roleInTeam: 'lead' },
  });

  // 4. Projects, environments, servers, applications, metrics, alerts
  const projects = [
    { name: 'E-Commerce Platform', description: 'Online shop and payment services' },
    { name: 'Mobile Banking API', description: 'Backend for the banking mobile app' },
    { name: 'Internal HR Portal', description: 'Employee management tools' },
  ];
  const providers = ['AWS', 'Azure', 'OVH', 'DigitalOcean'];
  const regions = ['eu-west-1', 'eu-central-1', 'us-east-1'];

  let n = 1;
  for (const p of projects) {
    const project = await prisma.project.create({ data: p });
    await prisma.projectAssignment.create({
      data: { projectId: project.id, teamId: team.id },
    });

    const prod = await prisma.environment.create({
      data: { name: 'PROD', projectId: project.id },
    });
    const dev = await prisma.environment.create({
      data: { name: 'DEV', projectId: project.id },
    });

    for (const env of [prod, dev]) {
      const server = await prisma.server.create({
        data: {
          name: `${env.name.toLowerCase()}-server-${n}`,
          provider: providers[n % providers.length],
          region: regions[n % regions.length],
          cpu: 2 + (n % 3) * 2,
          ram: 4 + (n % 3) * 4,
          storage: 50 * (1 + (n % 3)),
          ip: `10.0.${n}.${10 + n}`,
          status: n === 5 ? 'OFFLINE' : 'ONLINE',
          projectId: project.id,
        },
      });

      // two applications per server
      await prisma.application.createMany({
        data: [
          { name: 'api', version: '1.2.0', status: 'RUNNING', serverId: server.id, environmentId: env.id },
          { name: 'web', version: '2.0.1', status: n === 5 ? 'STOPPED' : 'RUNNING', serverId: server.id, environmentId: env.id },
        ],
      });

      // 30 metrics, one per minute over the last 30 minutes
      await prisma.metric.createMany({
        data: Array.from({ length: 30 }, (_, i) => ({
          serverId: server.id,
          cpuUsage: rand(20, 95),
          ramUsage: rand(30, 90),
          timestamp: new Date(Date.now() - (29 - i) * 60_000),
        })),
      });

      // one alert rule per server: CPU above 80%
      const rule = await prisma.alertRule.create({
        data: { serverId: server.id, metric: 'CPU', threshold: 80, severity: 'HIGH' },
      });

      // two example open alerts
      if (n === 2 || n === 5) {
        await prisma.alert.create({
          data: {
            ruleId: rule.id,
            serverId: server.id,
            severity: 'HIGH',
            message: `CPU above 80% on ${server.name}`,
            status: 'OPEN',
          },
        });
      }
      n++;
    }
  }

  console.log('Seed done:');
  console.log('  users:', await prisma.user.count());
  console.log('  projects:', await prisma.project.count());
  console.log('  servers:', await prisma.server.count());
  console.log('  applications:', await prisma.application.count());
  console.log('  metrics:', await prisma.metric.count());
  console.log('  alerts:', await prisma.alert.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());