import { Controller, Get, Param, Query } from '@nestjs/common';
import { DeviceService } from '../services/device.service';
import { ProcessArea } from '../types/device';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {
    console.log('DeviceController 已初始化');
  }

  @Get()
  async findAll(@Query('area') area?: ProcessArea) {
    console.log('收到获取设备列表请求, 区域:', area);
    const devices = await this.deviceService.findAll(area);
    console.log('返回设备数据:', devices);
    return devices;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deviceService.findOne(id);
  }
} 