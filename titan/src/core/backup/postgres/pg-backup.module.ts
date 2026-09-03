import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PgBackupService } from './pg-backup.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PgBackupService],
})
export class PgBackupModule {}