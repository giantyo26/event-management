import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  country: string;

  @OneToMany(() => Event, (event) => event.city, { cascade: true })
  events: Event[];
}
