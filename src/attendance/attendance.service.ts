import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import moment from 'moment-timezone';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  // Helper format timezone WIB
  private formatAttendance(attendance: Attendance) {
    return {
      ...attendance,

      attendance_date: attendance.attendance_date
        ? moment(attendance.attendance_date)
            .tz('Asia/Jakarta')
            .format('YYYY-MM-DD')
        : null,

      check_in: attendance.check_in
        ? moment(attendance.check_in)
            .tz('Asia/Jakarta')
            .format('YYYY-MM-DD HH:mm:ss')
        : null,

      check_out: attendance.check_out
        ? moment(attendance.check_out)
            .tz('Asia/Jakarta')
            .format('YYYY-MM-DD HH:mm:ss')
        : null,

      createdAt: attendance.createdAt
        ? moment(attendance.createdAt)
            .tz('Asia/Jakarta')
            .format('YYYY-MM-DD HH:mm:ss')
        : null,

      updatedAt: attendance.updatedAt
        ? moment(attendance.updatedAt)
            .tz('Asia/Jakarta')
            .format('YYYY-MM-DD HH:mm:ss')
        : null,
    };
  }

  // CHECK IN
  async checkIn(data: Partial<Attendance>) {
    const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

    // Cek apakah user sudah absen hari ini
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        user_id: data.user_id,
        attendance_date: today as unknown as Date,
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Anda sudah melakukan check in hari ini');
    }

    const now = moment().tz('Asia/Jakarta');

    let status = 'present';

    // Jam masuk maksimal 08:00
    if (now.hour() > 8 || (now.hour() === 8 && now.minute() > 0)) {
      status = 'late';
    }

    data.status = status;
    data.attendance_date = now.toDate();
    data.check_in = now.toDate();

    const attendance = await this.attendanceRepository.save(data);

    return this.formatAttendance(attendance);
  }

  // CHECK OUT
  async checkOut(userId: number) {
    const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

    const attendance = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.user_id = :userId', {
        userId,
      })
      .andWhere('DATE(attendance.attendance_date) = :today', { today })
      .getOne();

    if (!attendance) {
      throw new BadRequestException('Anda belum check in hari ini');
    }

    if (attendance.check_out) {
      throw new BadRequestException('Anda sudah melakukan check out hari ini');
    }

    attendance.check_out = moment().tz('Asia/Jakarta').toDate();

    const updatedAttendance = await this.attendanceRepository.save(attendance);

    return this.formatAttendance(updatedAttendance);
  }

  // Semua attendance + filter
  async findAll(date?: string, month?: string, year?: string) {
    let where: FindOptionsWhere<Attendance> = {};

    // Filter berdasarkan tanggal
    if (date) {
      where = {
        attendance_date: date as unknown as Date,
      };
    }

    // Filter berdasarkan bulan dan tahun
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);

      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

      where = {
        attendance_date: Between(startDate, endDate),
      };
    }

    const attendances = await this.attendanceRepository.find({
      where,
      relations: {
        user: true,
      },
      order: {
        attendance_date: 'DESC',
      },
    });

    return attendances.map((attendance) => this.formatAttendance(attendance));
  }

  // Attendance milik user login
  async findByUser(userId: number) {
    const attendances = await this.attendanceRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
      order: {
        attendance_date: 'DESC',
      },
    });

    return attendances.map((attendance) => this.formatAttendance(attendance));
  }

  // Riwayat attendance berdasarkan user (admin)
  async findByUserId(userId: number) {
    const attendances = await this.attendanceRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
      order: {
        attendance_date: 'DESC',
      },
    });

    return attendances.map((attendance) => this.formatAttendance(attendance));
  }
}
