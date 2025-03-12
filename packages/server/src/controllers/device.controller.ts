import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DeviceService } from '../services/device.service';
import { Device, ProcessArea } from '../types/device';

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

  @Post()
  async create(@Body() device: Device) {
    return this.deviceService.create(device);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() device: Device) {
    return this.deviceService.update(id, device);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deviceService.remove(id);
  }
} 