import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { Device, ProcessArea } from '../types/device';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) {}

  async findAll(area?: ProcessArea): Promise<Device[]> {
    const query = area ? { processArea: area } : {};
    return this.deviceModel.find(query).exec();
  }

  async findOne(id: string): Promise<Device | null> {
    return this.deviceModel.findById(id).exec();
  }

  async create(device: Partial<Device>): Promise<Device> {
    try {
      if (!device.deviceCode || !device.name || !device.processArea || 
          !device.pressureClass || !device.specification || !device.quickLink) {
        throw new Error('所有字段都是必需的');
      }

      const newDevice = new this.deviceModel({
        _id: new mongoose.Types.ObjectId(),
        deviceCode: device.deviceCode,
        name: device.name,
        pressureClass: device.pressureClass,
        specification: device.specification,
        quickLink: device.quickLink,
        processArea: device.processArea
      });

      await newDevice.validate();
      
      return await newDevice.save();
    } catch (error) {
      console.error('创建设备失败:', error);
      throw error;
    }
  }

  async update(id: string, device: Partial<Device>): Promise<Device | null> {
    return this.deviceModel.findByIdAndUpdate(id, device, { new: true }).exec();
  }

  async remove(id: string): Promise<Device | null> {
    return this.deviceModel.findByIdAndDelete(id).exec();
  }
} 