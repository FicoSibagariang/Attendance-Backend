import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Attendance])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
