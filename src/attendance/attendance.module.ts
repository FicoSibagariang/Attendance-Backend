import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
