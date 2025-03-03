import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Device } from '../../types/device';
import { deviceSeeds } from './device.seed';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

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

    console.log('正在获取 DeviceModel...');
    const deviceModel = app.get(getModelToken(Device.name));

    // 修改连接测试方法
    try {
      await deviceModel.findOne().exec();
      console.log('MongoDB 连接测试成功');
    } catch (error) {
      console.error('MongoDB 连接测试失败:', error);
      process.exit(1);
    }

    console.log('正在清空现有数据...');
    await deviceModel.deleteMany({}).exec();
    console.log('成功清空现有数据');

    console.log('正在插入种子数据...');
    await deviceModel.insertMany(deviceSeeds);
    console.log('成功插入种子数据');

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