import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// 工艺区域枚举
export enum ProcessArea {
  INLET = '进站区',
  FILTRATION = '过滤区',
  METERING = '计量区',
  HEATING = '加热区',
  PRESSURE_REGULATION = '调压区',
  OUTLET = '出站区'
}

// 压力等级枚举
export enum PressureClass {
  CLASS150 = 'CLASS150',
  CLASS300 = 'CLASS300',
  CLASS400 = 'CLASS400',
  CLASS600 = 'CLASS600',
  CLASS900 = 'CLASS900',
  CLASS1500 = 'CLASS1500'
}

@Schema()
export class Device {
  @Prop({ required: true })
  quickLink!: string;

  @Prop({ required: true })
  deviceCode!: string;

  @Prop({ required: true, enum: ProcessArea })
  processArea!: ProcessArea;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, enum: PressureClass })
  pressureClass!: PressureClass;

  @Prop()
  specification!: string;

  @Prop()
  _id?: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

// 创建设备的DTO
export interface CreateDeviceDto {
  quickLink: string;
  deviceCode: string;
  processArea: ProcessArea;
  name: string;
  pressureClass: PressureClass;
  specification: string;
}

// 更新设备的DTO
export interface UpdateDeviceDto {
  quickLink?: string;
  deviceCode?: string;
  processArea?: ProcessArea;
  name?: string;
  pressureClass?: PressureClass;
  specification?: string;
} 