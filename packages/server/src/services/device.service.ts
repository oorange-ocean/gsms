import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, ProcessArea } from '../types/device';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) {
    console.log('DeviceService 已初始化');
  }

  async findAll(area?: ProcessArea): Promise<Device[]> {
    console.log('查询设备数据, 区域:', area);
    let query = {};
    if (area) {
      query = { processArea: area };
    }
    console.log('MongoDB查询条件:', query);
    const devices = await this.deviceModel.find(query).exec();
    console.log('查询结果数量:', devices.length);
    return devices;
  }

  async findOne(id: string): Promise<Device | null> {
    return this.deviceModel.findById(id).exec();
  }
} 