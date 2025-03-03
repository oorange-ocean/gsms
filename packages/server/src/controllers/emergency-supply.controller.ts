import { Controller, Get, Param } from '@nestjs/common';
import { EmergencySupplyService } from '../services/emergency-supply.service';

@Controller('emergency-supplies')
export class EmergencySupplyController {
  constructor(private readonly emergencySupplyService: EmergencySupplyService) {
    console.log('EmergencySupplyController 已初始化');
  }

  @Get()
  async findAll() {
    console.log('收到获取应急物资列表请求');
    const supplies = await this.emergencySupplyService.findAll();
    console.log('返回应急物资数据:', supplies);
    return supplies;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.emergencySupplyService.findOne(id);
  }
} 