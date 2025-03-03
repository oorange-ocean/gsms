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
  CLASS900 = 'CLASS900'
}

// 设备接口
export interface Device {
  _id: string;
  quickLink: string;
  deviceCode: string;
  processArea: ProcessArea;
  name: string;
  pressureClass: PressureClass;
  specification: string;
} 