import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './rooms/room';
import { RoomsModule } from './rooms/rooms.module';
import { Order } from './orders/order';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { StubGenerator } from './StubGenerator';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number.parseInt(process.env.PG_PORT),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [Room, Order],
      synchronize: true
    }),
    TypeOrmModule.forFeature([Order, Room]),
    RoomsModule,
    OrdersModule
  ],
  controllers: [],
  providers: [StubGenerator]
})
export class AppModule {}
