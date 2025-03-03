import { AlertRecord, AlertType, AlertLevel } from '../../types/alert';
import { deviceSeeds } from './device.seed';
import { ProcessArea, PressureClass } from '../../types/device';

// 获取设备ID
const getDeviceById = (deviceCode: string) => {
  return deviceSeeds.find(device => device.deviceCode === deviceCode);
};

export const alertRecordSeeds: Partial<AlertRecord>[] = [
  {
    deviceId: 'HV206101',
    device: {
      _id: 'device_1',
      deviceCode: 'HV206101',
      name: '杭甬杭湖站区主干线气液联动阀',
      processArea: ProcessArea.INLET,
      quickLink: 'http://monitor.example.com/device/HV206101',
      pressureClass: PressureClass.CLASS400,
      specification: '800'
    },
    alertType: AlertType.PRESSURE,
    alertLevel: AlertLevel.WARNING,
    currentValue: 4.2,
    threshold: 4.0,
    timestamp: new Date(),
    processed: false
  },
  {
    deviceId: 'BV301102',
    device: {
      _id: 'device_2',
      deviceCode: 'BV301102',
      name: '杭嘉线收球笼进口管线电动球阀',
      processArea: ProcessArea.INLET,
      quickLink: 'http://monitor.example.com/device/BV301102',
      pressureClass: PressureClass.CLASS400,
      specification: '800'
    },
    alertType: AlertType.TEMPERATURE,
    alertLevel: AlertLevel.DANGER,
    currentValue: 85,
    threshold: 80,
    timestamp: new Date(),
    processed: false
  },
  {
    deviceId: 'HV301101',
    device: {
      _id: 'device_3',
      deviceCode: 'HV301101',
      name: '杭嘉线进站区主干线气液联动阀',
      processArea: ProcessArea.INLET,
      quickLink: 'http://monitor.example.com/device/HV301101',
      pressureClass: PressureClass.CLASS400,
      specification: '800'
    },
    alertType: AlertType.GAS_CONCENTRATION,
    alertLevel: AlertLevel.CRITICAL,
    currentValue: 12,
    threshold: 10,
    timestamp: new Date(),
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