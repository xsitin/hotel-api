import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>
  ) {}

  getAllRooms(): Promise<Room[]> {
    return this.roomsRepository.find();
  }

  getFreeRooms(from: Date, to: Date): Promise<Room[]> {
    const builder = this.roomsRepository.createQueryBuilder('room');
    const query = this.roomsRepository
      .createQueryBuilder('room')
      .where(
        'room.id NOT IN ' +
          builder
            .subQuery()
            .select('room.id')
            .from(Room, 'room')
            .innerJoin('order', 'order', 'room.id = order.roomId')
            .where(
              `order.from BETWEEN '${from.toISOString()}' AND '${to.toISOString()}'`
            )
            .orWhere(
              `order.to BETWEEN '${from.toISOString()}' AND '${to.toISOString()}'`
            )
            .getQuery()
      );
    return query.getMany();
  }
}
