import { Controller, Get, Put, Param, Query, Body } from '@nestjs/common';
import { AlertService } from '../services/alert.service';
import { DeviceAlertConfig, DeviceRealTimeData, AlertRecord } from '../types/alert';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {
    console.log('AlertController 已初始化');
  }

  // 获取预警配置
  @Get('configs')
  async getAlertConfigs(@Query('deviceId') deviceId?: string): Promise<DeviceAlertConfig[]> {
    console.log('收到获取预警配置请求, 设备ID:', deviceId);
    return this.alertService.getDeviceAlertConfigs(deviceId);
  }

  // 获取实时数据
  @Get('real-time')
  async getRealTimeData(@Query('deviceId') deviceId?: string): Promise<DeviceRealTimeData[]> {
    console.log('收到获取实时数据请求, 设备ID:', deviceId);
    return this.alertService.getDeviceRealTimeData(deviceId);
  }

  // 获取预警记录
  @Get('records')
  async getAlertRecords(@Query('processed') processed?: boolean): Promise<AlertRecord[]> {
    console.log('收到获取预警记录请求, 处理状态:', processed);
    return this.alertService.getAlertRecords(processed);
  }

  // 更新预警记录状态
  @Put('records/:id')
  async updateAlertRecord(
    @Param('id') id: string,
    @Body('processNote') processNote: string
  ): Promise<AlertRecord | null> {
    console.log('收到更新预警记录请求, ID:', id);
    return this.alertService.updateAlertRecord(id, processNote);
  }
} 