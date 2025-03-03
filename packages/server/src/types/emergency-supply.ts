import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmergencySupply extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  specification!: string;

  @Prop({ required: true })
  location!: string;

  @Prop({ required: true })
  configuredQuantity!: number;

  @Prop({ required: true })
  currentQuantity!: number;

  @Prop({ required: true })
  inspectionStatus!: string;

  @Prop()
  remarks?: string;
}

export const EmergencySupplySchema = SchemaFactory.createForClass(EmergencySupply);

// DTO
export interface CreateEmergencySupplyDto {
  name: string;
  specification: string;
  location: string;
  configuredQuantity: number;
  currentQuantity: number;
  inspectionStatus: string;
  remarks?: string;
}

export interface UpdateEmergencySupplyDto {
  name?: string;
  specification?: string;
  location?: string;
  configuredQuantity?: number;
  currentQuantity?: number;
  inspectionStatus?: string;
  remarks?: string;
} 