import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column({
    type: 'date',
  })
  attendance_date!: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  check_in!: Date | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  check_out!: Date | null;

  @Column()
  photo!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes!: string | null;

  @Column({
    type: 'enum',
    enum: ['present', 'late', 'absent'],
    default: 'present',
  })
  status!: string;

  @ManyToOne(() => User, (user) => user.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
