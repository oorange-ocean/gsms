import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongoDocument } from 'mongoose';

export enum DocumentCategory {
  REGULATION = '法规制度',
  OPERATION = '操作规程',
  EMERGENCY = '应急预案',
  MAINTENANCE = '维护手册',
  TRAINING = '培训资料'
}

@Schema()
export class Document {
  _id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true, enum: DocumentCategory })
  category!: DocumentCategory;

  @Prop()
  description!: string;

  @Prop({ required: true })
  fileUrl!: string;

  @Prop({ required: true })
  previewUrl!: string;

  @Prop({ required: true })
  uploadTime!: Date;

  @Prop({ required: true })
  fileSize!: number;

  @Prop({ required: true })
  fileType!: string;
}

export type DocumentDocument = Document & MongoDocument;
export const DocumentSchema = SchemaFactory.createForClass(Document); 