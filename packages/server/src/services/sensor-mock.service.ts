import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceRealTimeData } from '../types/alert';
import { Device } from '../types/device';

@Injectable()
export class SensorMockService {
  private mockDataInterval!: NodeJS.Timeout;

  constructor(
    @InjectModel('DeviceRealTimeData') private realTimeDataModel: Model<DeviceRealTimeData>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) {
    this.startMockDataGeneration();
  }

  private async startMockDataGeneration() {
    // 每5秒生成一次模拟数据
    this.mockDataInterval = setInterval(async () => {
      const devices = await this.deviceModel.find().exec();
      
      // 删除旧数据，只保留最近1小时的数据
      const oneHourAgo = new Date(Date.now() - 3600000);
      await this.realTimeDataModel.deleteMany({
        timestamp: { $lt: oneHourAgo }
      }).exec();
      
      // 为每个设备生成新数据
      const mockDataBatch = devices.map(device => ({
        deviceId: device.deviceCode,
        timestamp: new Date(),
        temperature: this.generateRandomValue(20, 80),    // 20-80°C
        pressure: this.generateRandomValue(2, 8),         // 2-8 MPa
        flowRate: this.generateRandomValue(100, 500),     // 100-500 m³/h
        valveStatus: Math.random() > 0.1,                 // 90%概率开启
        gasConcentration: this.generateRandomValue(0, 5)  // 0-5%
      }));

      // 批量插入数据
      await this.realTimeDataModel.insertMany(mockDataBatch);
    }, 5000);
  }

  private generateRandomValue(min: number, max: number): number {
    return +(min + Math.random() * (max - min)).toFixed(2);
  }

  onApplicationShutdown() {
    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
    }
  }
}