import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmergencyContact extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  department!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  mobile!: string;

  @Prop({ required: true })
  responsibility!: string;

  @Prop({ required: true })
  order!: number;
}

export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact); 