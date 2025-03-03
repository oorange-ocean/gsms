import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmergencyContact } from '../types/emergency-contact.schema';

@Injectable()
export class EmergencyContactService {
  constructor(
    @InjectModel(EmergencyContact.name) private readonly emergencyContactModel: Model<EmergencyContact>
  ) {}

  async findAll(): Promise<EmergencyContact[]> {
    return this.emergencyContactModel.find().sort('order').exec();
  }
} 