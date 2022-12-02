import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders/order';
import { Room } from './rooms/room';
import { faker } from '@faker-js/faker';

export class StubGenerator {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Room) private roomRepository: Repository<Room>
  ) {}

  public async generateStub() {
    const roomsCount = await this.roomRepository.count({});
    const ordersCount = await this.orderRepository.count({});
    const orders: Order[] = [];
    const rooms: Room[] = [];
    for (let i = roomsCount; i < 5; i++) {
      const room = new Room();
      room.name = faker.word.noun();
      rooms.push(room);
    }
    await this.roomRepository.save(rooms);
    for (let i = ordersCount; i < 5; i++) {
      const order = new Order();
      order.vip = false;
      order.room = (await this.roomRepository.findBy({}))[i];
      order.from = faker.date.past();
      order.to = faker.date.future();
      order.username = faker.name.fullName();
      orders.push(order);
    }
    await this.orderRepository.save(orders);
  }
}
