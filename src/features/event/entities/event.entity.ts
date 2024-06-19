import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { City } from '../../city/entities/city.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => City, (city) => city.events)
  city: City;

  @Column('decimal')
  price: number;
}
