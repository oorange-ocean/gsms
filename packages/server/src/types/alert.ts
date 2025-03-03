import { Device } from './device';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// 预警级别枚举
export enum AlertLevel {
  NORMAL = '正常',
  WARNING = '警告',
  DANGER = '危险',
  CRITICAL = '严重'
}

// 预警类型枚举
export enum AlertType {
  TEMPERATURE = '温度',
  PRESSURE = '压力',
  FLOW = '流量',
  VALVE_STATUS = '阀门状态',
  GAS_CONCENTRATION = '气体浓度'
}

// 设备预警配置接口
export interface DeviceAlertConfig {
  deviceId: string;
  alertType: AlertType;
  warningThreshold: number;   // 警告阈值
  dangerThreshold: number;    // 危险阈值
  criticalThreshold: number;  // 严重阈值
  unit: string;              // 单位
}

// 设备实时数据接口
export interface DeviceRealTimeData {
  deviceId: string;
  timestamp: Date;
  temperature?: number;      // 温度 (°C)
  pressure?: number;         // 压力 (MPa)
  flowRate?: number;         // 流量 (m³/h)
  valveStatus?: boolean;     // 阀门状态 (开/关)
  gasConcentration?: number; // 气体浓度 (%)
}

@Schema()
export class AlertRecord extends Document {
  @Prop({ required: true })
  deviceId!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Device' })
  device!: Device;

  @Prop({ required: true })
  alertType!: string;

  @Prop({ required: true })
  alertLevel!: string;

  @Prop({ required: true })
  currentValue!: number;

  @Prop({ required: true })
  threshold!: number;

  @Prop({ required: true })
  timestamp!: Date;

  @Prop({ default: false })
  processed!: boolean;

  @Prop()
  processNote?: string;

  @Prop()
  processTime?: Date;
}

export const AlertRecordSchema = SchemaFactory.createForClass(AlertRecord); 