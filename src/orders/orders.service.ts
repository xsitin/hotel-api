import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>
  ) {}

  //there could be request to another site for check vip
  private async isVip(order: Order) {
    return (
      (await this.ordersRepository.findBy({ username: order.username }))
        .length > 0
    );
  }

  async addOrder(order: Order): Promise<Order> {
    order.vip = await this.isVip(order);
    await this.ordersRepository.manager.transaction(
      'REPEATABLE READ',
      async (transactionManager) => {
        const rep = await transactionManager.getRepository(Order);
        const intersection = await rep.findBy([
          {
            room: order.room,
            to: Between(
              new Date(new Date(order.from).getTime() + 1),
              new Date(order.to)
            )
          },
          {
            room: order.room,
            from: Between(
              new Date(new Date(order.from).getTime() - 1),
              new Date(order.to)
            )
          },
          {
            room: order.room,
            from: LessThanOrEqual(new Date(order.from)),
            to: MoreThanOrEqual(new Date(order.from))
          },
          {
            room: order.room,
            from: LessThanOrEqual(new Date(order.to)),
            to: MoreThanOrEqual(new Date(order.to))
          }
        ]);
        if (intersection.length > 0)
          throw new BadRequestException('booked at that time');

        order = await rep.save(order);
      }
    );

    return order;
  }

  async deleteOrder(order: Order): Promise<boolean> {
    const result = await this.ordersRepository.delete({
      id: order.id,
      username: order.username
    });
    return result.affected == 1;
  }
}
