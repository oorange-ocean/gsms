import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Device } from '../../types/device';
import { deviceSeeds } from './device.seed';
import { Document } from '../../types/document';
import { documentSeeds } from './document.seed';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { EmergencySupply } from '../../types/emergency-supply';
import { emergencySupplySeeds } from './emergency-supply.seed';

// 加载环境变量
dotenv.config({ path: '.env' });

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
  process.exit(1);
});

console.log('脚本开始执行');
console.log('当前工作目录:', process.cwd());
console.log('环境变量:', {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI
});

async function bootstrap() {
  console.log('开始执行种子脚本...');
  
  // 设置 mongoose debug 模式
  mongoose.set('debug', true);
  
  try {
    // 使用本地环境变量或默认值
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/gsms';
    console.log('正在创建应用上下文...');
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // 等待连接就绪
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 获取设备和文档模型
    console.log('正在获取数据模型...');
    const deviceModel = app.get(getModelToken(Device.name));
    const documentModel = app.get(getModelToken(Document.name));

    // 测试数据库连接
    try {
      await deviceModel.findOne().exec();
      await documentModel.findOne().exec();
      console.log('MongoDB 连接测试成功');
    } catch (error) {
      console.error('MongoDB 连接测试失败:', error);
      process.exit(1);
    }

    // 清空现有数据
    console.log('正在清空现有数据...');
    await deviceModel.deleteMany({}).exec();
    await documentModel.deleteMany({}).exec();
    console.log('成功清空现有数据');

    // 插入种子数据
    console.log('正在插入设备种子数据...');
    await deviceModel.insertMany(deviceSeeds);
    console.log('成功插入设备种子数据');

    console.log('正在插入文档种子数据...');
    await documentModel.insertMany(documentSeeds);
    console.log('成功插入文档种子数据');

    // 获取应急物资模型
    const emergencySupplyModel = app.get(getModelToken(EmergencySupply.name));

    // 清空现有数据
    await emergencySupplyModel.deleteMany({}).exec();

    // 插入种子数据
    console.log('正在插入应急物资种子数据...');
    await emergencySupplyModel.insertMany(emergencySupplySeeds);
    console.log('成功插入应急物资种子数据');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('执行过程中发生错误:', error);
    process.exit(1);
  }
}

// 设置更长的超时时间
const timeout = setTimeout(() => {
  console.error('脚本执行超时');
  process.exit(1);
}, 30000);

process.on('exit', () => {
  clearTimeout(timeout);
});

bootstrap(); 