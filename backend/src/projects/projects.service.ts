import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

// Counts shown with every project (no extra queries from the client).
const withCounts = {
  _count: { select: { servers: true, environments: true } },
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto, include: withCounts });
  }

  findAll() {
    return this.prisma.project.findMany({
      include: withCounts,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { ...withCounts, environments: true },
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id); // 404 if it does not exist
    return this.prisma.project.update({
      where: { id },
      data: dto,
      include: withCounts,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // 404 if it does not exist
    // Cascade in schema.prisma also deletes its environments and servers.
    await this.prisma.project.delete({ where: { id } });
    return { message: `Project ${id} deleted` };
  }
}