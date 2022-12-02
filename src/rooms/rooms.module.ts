import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule, TypeOrmModule.forFeature([Room])],
  providers: [RoomsService],
  controllers: [RoomsController]
})
export class RoomsModule {}
