import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmergencySupply } from '../types/emergency-supply';

@Injectable()
export class EmergencySupplyService {
  constructor(
    @InjectModel(EmergencySupply.name) private emergencySupplyModel: Model<EmergencySupply>,
  ) {
    console.log('EmergencySupplyService 已初始化');
  }

  async findAll(): Promise<EmergencySupply[]> {
    console.log('查询应急物资数据');
    const supplies = await this.emergencySupplyModel.find().exec();
    console.log('查询结果数量:', supplies.length);
    return supplies;
  }

  async findOne(id: string): Promise<EmergencySupply | null> {
    return this.emergencySupplyModel.findById(id).exec();
  }
} 