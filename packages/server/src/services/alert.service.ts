import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceAlertConfig, DeviceRealTimeData, AlertRecord, AlertType, AlertLevel } from '../types/alert';
import { Device } from '../types/device';

@Injectable()
export class AlertService {
  constructor(
    @InjectModel('DeviceAlertConfig') private alertConfigModel: Model<DeviceAlertConfig>,
    @InjectModel('DeviceRealTimeData') private realTimeDataModel: Model<DeviceRealTimeData>,
    @InjectModel('AlertRecord') private alertRecordModel: Model<AlertRecord>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) {
    console.log('AlertService 已初始化');
  }

  // 获取设备的预警配置
  async getDeviceAlertConfigs(deviceId?: string): Promise<DeviceAlertConfig[]> {
    const query = deviceId ? { deviceId } : {};
    return this.alertConfigModel.find(query).exec();
  }

  // 获取设备的实时数据
  async getDeviceRealTimeData(deviceId?: string): Promise<DeviceRealTimeData[]> {
    const query = deviceId ? { deviceId } : {};
    return this.realTimeDataModel.find(query)
      .sort({ timestamp: -1 })
      .limit(deviceId ? 1 : 100)  // 如果指定设备则只返回最新一条
      .exec();
  }

  // 获取预警记录
  async getAlertRecords(processed?: boolean): Promise<AlertRecord[]> {
    const query = processed !== undefined ? { processed } : {};
    return this.alertRecordModel.find(query)
      .populate('device')  // 关联设备信息
      .sort({ timestamp: -1 })
      .exec();
  }

  // 更新预警记录状态
  async updateAlertRecord(id: string, processNote: string): Promise<AlertRecord | null> {
    return this.alertRecordModel.findByIdAndUpdate(
      id,
      { 
        processed: true,
        processNote,
        processTime: new Date()
      },
      { new: true }
    ).exec();
  }

  // 检查并生成预警
  async checkAndGenerateAlerts(realTimeData: DeviceRealTimeData): Promise<AlertRecord[]> {
    const configs = await this.alertConfigModel.find({ deviceId: realTimeData.deviceId }).exec();
    const device = await this.deviceModel.findOne({ deviceCode: realTimeData.deviceId }).exec();
    const alerts: AlertRecord[] = [];

    for (const config of configs) {
      const value = this.getValueByAlertType(realTimeData, config.alertType);
      if (value === undefined) continue;

      let alertLevel: AlertLevel | null = null;

      if (value >= config.criticalThreshold) {
        alertLevel = AlertLevel.CRITICAL;
      } else if (value >= config.dangerThreshold) {
        alertLevel = AlertLevel.DANGER;
      } else if (value >= config.warningThreshold) {
        alertLevel = AlertLevel.WARNING;
      }

      if (alertLevel) {
        const alert = new this.alertRecordModel({
          deviceId: realTimeData.deviceId,
          device: device?._id,
          alertType: config.alertType,
          alertLevel,
          currentValue: value,
          threshold: this.getThresholdByLevel(config, alertLevel),
          timestamp: realTimeData.timestamp,
          processed: false
        });
        alerts.push(await alert.save());
      }
    }

    return alerts;
  }

  private getValueByAlertType(data: DeviceRealTimeData, type: AlertType): number | undefined {
    switch (type) {
      case AlertType.TEMPERATURE:
        return data.temperature;
      case AlertType.PRESSURE:
        return data.pressure;
      case AlertType.FLOW:
        return data.flowRate;
      case AlertType.GAS_CONCENTRATION:
        return data.gasConcentration;
      default:
        return undefined;
    }
  }

  private getThresholdByLevel(config: DeviceAlertConfig, level: AlertLevel): number {
    switch (level) {
      case AlertLevel.WARNING:
        return config.warningThreshold;
      case AlertLevel.DANGER:
        return config.dangerThreshold;
      case AlertLevel.CRITICAL:
        return config.criticalThreshold;
      default:
        return 0;
    }
  }
} 