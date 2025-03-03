import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { deviceSeeds } from './device.seed';
import { Device, DeviceSchema } from '../../types/device';
import { Module } from '@nestjs/common';

// 创建一个独立的模块来运行种子
const SeedModule = MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017');
const DeviceFeatureModule = MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]);

@Module({
  imports: [SeedModule, DeviceFeatureModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const deviceModel = app.get('DeviceModel');
  
  // 清空现有数据
  await deviceModel.deleteMany({});
  
  // 插入种子数据
  await deviceModel.insertMany(deviceSeeds);
  
  console.log('数据库种子数据已成功植入');
  await app.close();
}

bootstrap(); 