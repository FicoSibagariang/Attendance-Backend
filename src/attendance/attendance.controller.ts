import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';

import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Request } from 'express';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // CHECK IN
  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',

        filename: (req, file, callback) => {
          const filename = Date.now() + extname(file.originalname);

          callback(null, filename);
        },
      }),
    }),
  )
  checkIn(
    @UploadedFile() file: Express.Multer.File,
    @Req()
    req: Request & {
      user: {
        id: number;
      };
    },
  ) {
    return this.attendanceService.checkIn({
      user_id: req.user.id,
      attendance_date: new Date(),
      check_in: new Date(),
      photo: file.filename,
      status: 'present',
    });
  }

  // CHECK OUT
  @UseGuards(JwtAuthGuard)
  @Put('check-out')
  checkOut(
    @Req()
    req: Request & {
      user: {
        id: number;
      };
    },
  ) {
    return this.attendanceService.checkOut(req.user.id);
  }

  // HISTORY USER YANG LOGIN
  @UseGuards(JwtAuthGuard)
  @Get('my-attendance')
  myAttendance(
    @Req()
    req: Request & {
      user: {
        id: number;
      };
    },
  ) {
    return this.attendanceService.findByUser(req.user.id);
  }

  // HISTORY USER BERDASARKAN ID (ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('user/:id')
  findUserAttendance(@Param('id') id: string) {
    return this.attendanceService.findByUserId(+id);
  }

  // SEMUA ATTENDANCE + FILTER
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll(
    @Query('date') date?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.attendanceService.findAll(date, month, year);
  }
}
