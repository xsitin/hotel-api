import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../rooms/room';
import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsDate()
  @Type(() => Date)
  from: Date;
  @Column()
  @IsDate()
  @Type(() => Date)
  to: Date;
  @ManyToOne(() => Room, (room) => room.orders)
  room: Room;
  @Column()
  @IsString()
  username: string;
  @Column()
  vip: boolean;
}
