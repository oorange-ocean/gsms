console.log('测试脚本开始执行');

import mongoose from 'mongoose';

// 设置全局超时
const TIMEOUT = 10000;
let timeoutHandle: NodeJS.Timeout;

// 从环境变量获取连接字符串，如果没有则使用默认值
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gsms';

console.log('环境信息:', {
  NODE_ENV: process.env.NODE_ENV,
  工作目录: process.cwd(),
  连接超时设置: TIMEOUT
});

mongoose.set('debug', true); // 启用调试模式查看详细日志

function setupTimeout() {
  timeoutHandle = setTimeout(() => {
    console.error('连接超时，强制退出');
    process.exit(1);
  }, TIMEOUT);
}

async function testConnection() {
  setupTimeout();
  
  try {
    console.log('开始测试MongoDB连接...');
    
    // 设置事件监听
    mongoose.connection.on('connecting', () => console.log('正在连接...'));
    mongoose.connection.on('connected', () => console.log('连接成功！'));
    mongoose.connection.on('error', (err) => console.error('连接错误:', err));
    mongoose.connection.on('disconnected', () => console.log('已断开连接'));
    
    // 尝试连接
    console.log('尝试连接到:', MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    // 测试写入
    const collection = mongoose.connection.collection('test');
    await collection.insertOne({ test: true, timestamp: new Date() });
    console.log('测试数据写入成功');
    
    // 清理并退出
    await mongoose.disconnect();
    clearTimeout(timeoutHandle);
    process.exit(0);
    
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    clearTimeout(timeoutHandle);
    process.exit(1);
  }
}

testConnection(); 