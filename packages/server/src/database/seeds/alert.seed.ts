import { AlertRecord } from '../../types/alert';

export const alertConfigSeeds: Partial<AlertRecord>[] = [
  {
    deviceId: 'HV206101',
    alertType: '压力',
    alertLevel: '警告',
    currentValue: 4.2,
    threshold: 4.0,
    timestamp: new Date(),
    processed: false
  },
  {
    deviceId: 'BV301102',
    alertType: '温度',
    alertLevel: '危险',
    currentValue: 85,
    threshold: 80,
    timestamp: new Date(),
    processed: false
  },
  {
    deviceId: 'HV301101',
    alertType: '气体浓度',
    alertLevel: '严重',
    currentValue: 12,
    threshold: 10,
    timestamp: new Date(),
    processed: false
  }
]; 