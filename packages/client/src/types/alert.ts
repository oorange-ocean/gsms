export enum AlertLevel {
  NORMAL = '正常',
  WARNING = '警告',
  DANGER = '危险',
  CRITICAL = '严重'
}

export enum AlertType {
  TEMPERATURE = '温度',
  PRESSURE = '压力',
  FLOW = '流量',
  VALVE_STATUS = '阀门状态',
  GAS_CONCENTRATION = '气体浓度'
}

export interface DeviceAlertConfig {
  _id: string;
  deviceId: string;
  alertType: AlertType;
  warningThreshold: number;
  dangerThreshold: number;
  criticalThreshold: number;
  unit: string;
}

export interface DeviceRealTimeData {
  _id: string;
  deviceId: string;
  timestamp: string;
  temperature?: number;
  pressure?: number;
  flowRate?: number;
  valveStatus?: boolean;
  gasConcentration?: number;
}

export interface AlertRecord {
  _id: string;
  deviceId: string;
  device: {
    _id: string;
    deviceCode: string;
    name: string;
    processArea: string;
  };
  alertType: AlertType;
  alertLevel: AlertLevel;
  currentValue: number;
  threshold: number;
  timestamp: string;
  processed: boolean;
  processNote?: string;
  processTime?: string;
} 