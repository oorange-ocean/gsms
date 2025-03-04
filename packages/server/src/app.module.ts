import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Device, DeviceSchema } from './types/device';
import { DeviceController } from './controllers/device.controller';
import { DeviceService } from './services/device.service';
import { Document, DocumentSchema } from './types/document';
import { DocumentController } from './controllers/document.controller';
import { DocumentService } from './services/document.service';
import { EmergencySupply, EmergencySupplySchema } from './types/emergency-supply';
import { EmergencySupplyController } from './controllers/emergency-supply.controller';
import { EmergencySupplyService } from './services/emergency-supply.service';
import { AlertController } from './controllers/alert.controller';
import { AlertService } from './services/alert.service';
import mongoose from 'mongoose';
import { AlertRecord, AlertRecordSchema } from './types/alert';
import { EmergencyContactController } from './controllers/emergency-contact.controller';
import { EmergencyContactService } from './services/emergency-contact.service';
import { EmergencyContact, EmergencyContactSchema } from './types/emergency-contact.schema';
import { Scene, SceneSchema } from './types/scene';
import { SceneController } from './controllers/scene.controller';
import { SceneService } from './services/scene.service';

// 添加预警模块相关的 Schema
const AlertConfigSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  alertType: { type: String, required: true },
  warningThreshold: { type: Number, required: true },
  dangerThreshold: { type: Number, required: true },
  criticalThreshold: { type: Number, required: true },
  unit: { type: String, required: true }
});

const RealTimeDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  timestamp: { type: Date, required: true },
  temperature: Number,
  pressure: Number,
  flowRate: Number,
  valveStatus: Boolean,
  gasConcentration: Number
});

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/gsms', {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB连接成功');
        });
        connection.on('error', (err: any) => {
          console.error('MongoDB连接错误:', err);
        });
        return connection;
      },
    }),
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: Document.name, schema: DocumentSchema },
      { name: EmergencySupply.name, schema: EmergencySupplySchema },
      { name: 'DeviceAlertConfig', schema: AlertConfigSchema },
      { name: 'DeviceRealTimeData', schema: RealTimeDataSchema },
      { name: AlertRecord.name, schema: AlertRecordSchema },
      { name: EmergencyContact.name, schema: EmergencyContactSchema },
      { name: Scene.name, schema: SceneSchema }
    ]),
  ],
  controllers: [
    AppController, 
    DeviceController, 
    DocumentController,
    EmergencySupplyController,
    AlertController,
    EmergencyContactController,
    SceneController
  ],
  providers: [
    AppService, 
    DeviceService, 
    DocumentService,
    EmergencySupplyService,
    AlertService,
    EmergencyContactService,
    SceneService
  ],
})
export class AppModule {}
