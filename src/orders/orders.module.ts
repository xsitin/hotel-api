import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
