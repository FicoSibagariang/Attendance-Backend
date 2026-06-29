import { Controller, Get, UseGuards, Req } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { Request } from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  dashboard() {
    return this.dashboardService.getDashboard();
  }

  // Dashboard employee
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyDashboard(
    @Req()
    req: Request & {
      user: {
        id: number;
      };
    },
  ) {
    return this.dashboardService.getMyDashboard(req.user.id);
  }
}
