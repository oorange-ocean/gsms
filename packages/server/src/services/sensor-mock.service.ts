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

  private generateRandomValue(min: number, max: number, prevValue?: number): number {
    if (prevValue !== undefined) {
      // 基于上一个值生成新值，确保变化平滑
      const maxChange = (max - min) * 0.1; // 最大变化幅度为范围的10%
      const change = (Math.random() * 2 - 1) * maxChange;
      const newValue = prevValue + change;
      return +Math.min(max, Math.max(min, newValue)).toFixed(2);
    }
    return +(min + Math.random() * (max - min)).toFixed(2);
  }

  private async startMockDataGeneration() {
    let prevValues = new Map<string, {
      temperature: number,
      pressure: number,
      flowRate: number,
      gasConcentration: number
    }>();

    this.mockDataInterval = setInterval(async () => {
      const devices = await this.deviceModel.find().exec();
      
      // 删除旧数据
      const oneHourAgo = new Date(Date.now() - 3600000);
      await this.realTimeDataModel.deleteMany({
        timestamp: { $lt: oneHourAgo }
      }).exec();
      
      // 生成新数据
      const mockDataBatch = devices.map(device => {
        const prev = prevValues.get(device.deviceCode) || {
          temperature: this.generateRandomValue(20, 80),
          pressure: this.generateRandomValue(2, 8),
          flowRate: this.generateRandomValue(100, 500),
          gasConcentration: this.generateRandomValue(0, 5)
        };

        const newData = {
          deviceId: device.deviceCode,
          timestamp: new Date(),
          temperature: this.generateRandomValue(20, 80, prev.temperature),
          pressure: this.generateRandomValue(2, 8, prev.pressure),
          flowRate: this.generateRandomValue(100, 500, prev.flowRate),
          valveStatus: Math.random() > 0.1,
          gasConcentration: this.generateRandomValue(0, 5, prev.gasConcentration)
        };

        prevValues.set(device.deviceCode, {
          temperature: newData.temperature,
          pressure: newData.pressure,
          flowRate: newData.flowRate,
          gasConcentration: newData.gasConcentration
        });

        return newData;
      });

      await this.realTimeDataModel.insertMany(mockDataBatch);
    }, 5000);
  }

  onApplicationShutdown() {
    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
    }
  }
}