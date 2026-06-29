import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Repository, Between } from 'typeorm';
import moment from 'moment-timezone';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  // Dashboard Admin
  async getDashboard() {
    const totalEmployee = await this.userRepository.count({
      where: {
        role: 'employee',
      },
    });

    const start = moment().tz('Asia/Jakarta').startOf('day').toDate();

    const end = moment().tz('Asia/Jakarta').endOf('day').toDate();

    const presentToday = await this.attendanceRepository.count({
      where: {
        attendance_date: Between(start, end),
      },
    });

    const lateToday = await this.attendanceRepository.count({
      where: {
        attendance_date: Between(start, end),
        status: 'late',
      },
    });

    return {
      total_employee: totalEmployee,
      present_today: presentToday,
      late_today: lateToday,
    };
  }

  // Dashboard Employee
  async getMyDashboard(userId: number) {
    // ambil data user
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // absensi hari ini
    const startToday = moment().tz('Asia/Jakarta').startOf('day').toDate();

    const endToday = moment().tz('Asia/Jakarta').endOf('day').toDate();

    const attendance = await this.attendanceRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        attendance_date: Between(startToday, endToday),
      },
    });

    // awal dan akhir bulan
    const startMonth = moment().tz('Asia/Jakarta').startOf('month').toDate();

    const endMonth = moment().tz('Asia/Jakarta').endOf('month').toDate();

    const totalAttendanceMonth = await this.attendanceRepository.count({
      where: {
        user: {
          id: userId,
        },
        attendance_date: Between(startMonth, endMonth),
      },
    });

    const totalLateMonth = await this.attendanceRepository.count({
      where: {
        user: {
          id: userId,
        },
        attendance_date: Between(startMonth, endMonth),
        status: 'late',
      },
    });

    return {
      employee_name: user?.name ?? null,
      department: user?.department ?? null,

      today_status: attendance?.status ?? 'belum_absen',

      check_in: attendance?.check_in
        ? moment(attendance.check_in)
            .tz('Asia/Jakarta')
            .format('YYYY-MM-DD HH:mm:ss')
        : null,

      check_out: attendance?.check_out
        ? moment(attendance.check_out)
            .tz('Asia/Jakarta')
            .format('YYYY-MM-DD HH:mm:ss')
        : null,

      total_attendance_month: totalAttendanceMonth,
      total_late_month: totalLateMonth,
    };
  }
}
