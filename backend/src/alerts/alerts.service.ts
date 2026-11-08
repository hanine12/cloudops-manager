import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto.js';
import { UpdateAlertDto } from './dto/update-alert.dto.js';

@Injectable()
export class AlertsService {
  create(createAlertDto: CreateAlertDto) {
    return 'This action adds a new alert';
  }

  findAll() {
    return `This action returns all alerts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alert`;
  }

  update(id: number, updateAlertDto: UpdateAlertDto) {
    return `This action updates a #${id} alert`;
  }

  remove(id: number) {
    return `This action removes a #${id} alert`;
  }
}
