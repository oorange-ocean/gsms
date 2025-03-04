import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Location {
  lng: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

@Schema()
export class Scene extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: Object, required: true })
  location!: Location;

  @Prop({ required: true })
  imageUrl!: string;

  @Prop()
  audioUrl?: string;

  @Prop()
  videoUrl?: string;

  @Prop({ type: [String] })
  tags!: string[];
}

export const SceneSchema = SchemaFactory.createForClass(Scene); 