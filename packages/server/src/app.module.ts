import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Device, DeviceSchema } from './types/device';

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
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
