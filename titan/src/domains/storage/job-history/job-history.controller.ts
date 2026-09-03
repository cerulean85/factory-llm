import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { JobHistoryService as JobHistoryService } from './job-history.service';
import { CreateJobHistoryDto } from './dto/request/create-job-history.dto';
import { UpdateJobHistoryDto } from './dto/request/update-job-history.dto';
import { plainToInstance } from 'class-transformer';
import { JobHistoryResponseDto } from './dto/response/job-history-response.dto';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';

@Controller('job-history')
export class JobHistoryController {
  constructor(
    private readonly jobHistoryService: JobHistoryService,
  ) {}
  @Post('create-job-history')
  @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(JobHistoryResponseDto, "job 내역 생성", "job 내역 생성", "job 내역 생성" )
  async createJobHistory(
    @Body() createJobHistoryDto: CreateJobHistoryDto
  ) {
    const rawData = await this.jobHistoryService.createJobHistory(createJobHistoryDto);
    const result = plainToInstance(JobHistoryResponseDto, rawData, { excludeExtraneousValues: true });
    return result;
  }

  @Put('update-job-history/:jobHistoryId')
  @UseGuards(JwtServiceAuthGuard)
  async updateJobHistory(
    @Body() updateJobHistoryDto: UpdateJobHistoryDto,
    @Param('jobHistoryId') jobHistoryId: number
  ) {
    const result = await this.jobHistoryService.updateJobHistory(jobHistoryId, updateJobHistoryDto);
    return result;
  }
}