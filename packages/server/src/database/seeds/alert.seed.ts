import { AlertLevel, AlertType } from '../../types/alert';

export const alertRecordSeeds = [
  {
    deviceId: 'HV206101',
    alertType: AlertType.PRESSURE,
    alertLevel: AlertLevel.WARNING,
    currentValue: 4.2,
    threshold: 4.0,
    timestamp: new Date('2024-03-01T10:00:00Z'),
    processed: false
  },
  {
    deviceId: 'HV301101',
    alertType: AlertType.TEMPERATURE,
    alertLevel: AlertLevel.DANGER,
    currentValue: 85,
    threshold: 80,
    timestamp: new Date('2024-03-01T11:30:00Z'),
    processed: false
  },
  {
    deviceId: 'BV301102',
    alertType: AlertType.GAS_CONCENTRATION,
    alertLevel: AlertLevel.CRITICAL,
    currentValue: 12,
    threshold: 10,
    timestamp: new Date('2024-03-01T12:00:00Z'),
    processed: false
  }
];

export const alertConfigSeeds = [
  {
    deviceId: 'HV206101',
    alertType: AlertType.PRESSURE,
    warningThreshold: 6.0,
    dangerThreshold: 6.5,
    criticalThreshold: 7.0,
    unit: 'MPa'
  }
  // ... 可以添加更多配置
]; 