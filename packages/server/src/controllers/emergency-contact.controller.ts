import { Controller, Get } from '@nestjs/common';
import { EmergencyContactService } from '../services/emergency-contact.service';

@Controller('emergency-contacts')
export class EmergencyContactController {
  constructor(private readonly emergencyContactService: EmergencyContactService) {}

  @Get()
  async findAll() {
    return this.emergencyContactService.findAll();
  }
} 