import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SensorMockService } from './services/sensor-mock.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly sensorMockService: SensorMockService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
