import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertsService } from './alerts.service.js';
import { CreateAlertDto } from './dto/create-alert.dto.js';
import { UpdateAlertDto } from './dto/update-alert.dto.js';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.create(createAlertDto);
  }

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertsService.update(+id, updateAlertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(+id);
  }
}
