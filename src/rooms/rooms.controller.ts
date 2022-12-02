import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './room';
import { Order } from '../orders/order';
import { OrdersService } from '../orders/orders.service';

@Controller('room')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private orderService: OrdersService
  ) {}

  @Get('all')
  getAllRooms(): Promise<Room[]> {
    return this.roomsService.getAllRooms();
  }

  @Get('free')
  getFreeRooms(
    @Query('from') from: string,
    @Query('to') to: string
  ): Promise<Room[]> {
    if (isNaN(Date.parse(from)) || isNaN(Date.parse(to)))
      throw new BadRequestException('Invalid date format');
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return this.roomsService.getFreeRooms(fromDate, toDate);
  }

  @Post('book')
  bookRoom(@Body() order: Order): Promise<Order> {
    return this.orderService.addOrder(order);
  }

  @Delete('cancel')
  async cancelBook(@Body() order: Order) {
    if (await this.orderService.deleteOrder(order)) return;
    else throw new NotFoundException('order not found');
  }
}
