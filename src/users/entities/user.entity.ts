import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @Column()
  position!: string;

  @Column()
  department!: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances!: Attendance[];
}
