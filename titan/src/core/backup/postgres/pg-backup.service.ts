import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { databaseConfig } from 'src/config/database.config';
import { backupConfig } from 'src/config/backup.config';
import { DateDaySplit } from 'src/utils/date-transform.util';

@Injectable()
export class PgBackupService {
  private readonly BACKUP_DIR = backupConfig.backupDirPath === '' ? path.join(__dirname, '..', 'backups') : backupConfig.backupDirPath;
  private readonly RETENTION_DAYS = backupConfig.retentionDays; // 파일 보관 기간
  private readonly logger = new Logger(PgBackupService.name)
  constructor() {
    if (!fs.existsSync(this.BACKUP_DIR)) {
      fs.mkdirSync(this.BACKUP_DIR);
    }
  }

  // ┌───────────── minute (0 - 59)
  // │ ┌───────────── hour (0 - 23)
  // │ │ ┌───────────── day of month (1 - 31)
  // │ │ │ ┌───────────── month (1 - 12)
  // │ │ │ │ ┌───────────── day of week (0 - 6) (0 = Sunday)
  // │ │ │ │ │
  // │ │ │ │ │
  // * * * * *
  // ex) ('0 0 * * 0') // 매주 일요일 자정에 실행

  //@Cron('0 0 * * *')
  @Cron(function() {
    return new PgBackupService().generateCronExpression(
      backupConfig.minute
      , backupConfig.hour
      , backupConfig.dayOfMonth
      , backupConfig.month
      , backupConfig.dayOfWeek
    );
  }())
  async handleBackup() {
    if (!this.isPgDumpAvailable()) {
      this.logger.warn('Warning: "pg_dump" command is not available in the system PATH. Please add PostgreSQL bin directory to the PATH environment variable.');
      return;
    }


    const backupFileName = `backup_${this.getFormattedDate()}.sql`;
    const backupFilePath = path.join(this.BACKUP_DIR, backupFileName);

    const command = `pg_dump -U ${databaseConfig.username} -h ${databaseConfig.host} -p ${databaseConfig.port} -d ${databaseConfig.database} -F c -b -v -f "${backupFilePath}"`;
    //복구 : pg_restore -U postgres -h localhost -p 5432 -d titan -v "C:\Users\Hanwha\0_CPY\Source\00_SW_Solution\2025_titan\titan_was\src\core\backups\test.sql"

    exec(command, { env: { ...process.env, PGPASSWORD: databaseConfig.password } }, (error, stdout, stderr) => {
      if (error) {
        this.logger.error(`Backup failed:` , error.stack);
        return;
      }

      if (stderr) {
        this.logger.warn(`Backup warning: ${stderr}`);
      }

      this.logger.log(`Backup successful: ${backupFileName}`);
    });

    this.deleteOldBackups();
  }

  //저장할 날짜 포맷 생성
  private getFormattedDate(): string {
    const date = new Date();
    return DateDaySplit(date);//date.toISOString().slice(0, 10).replace(/-/g, '');
  }

  //cron 포맷에 맞게 변경 : 음수일 경우 * 처리
  private validateAndFormatCronValue(value: number, maxValue: number): string {
    if (value < 0) return '*';
    if (value > maxValue) return String(maxValue);
    return String(value);
  }
  
  //cron 포맷 생성
  private generateCronExpression(minute: number, hour: number, dayOfMonth: number, month: number, dayOfWeek: number): string {
    const minuteStr = this.validateAndFormatCronValue(minute, 59);
    const hourStr = this.validateAndFormatCronValue(hour, 23);
    const dayOfMonthStr = this.validateAndFormatCronValue(dayOfMonth, 31);
    const monthStr = this.validateAndFormatCronValue(month, 12);
    const dayOfWeekStr = this.validateAndFormatCronValue(dayOfWeek, 6);
    
    return `${minuteStr} ${hourStr} ${dayOfMonthStr} ${monthStr} ${dayOfWeekStr}`;
  }


  //pg_dump 환경변수 등록 안되어있을 경우 체크
  private isPgDumpAvailable(): boolean {
    try {
      const result = require('child_process').execSync('pg_dump --version', { stdio: 'pipe', encoding: 'utf-8' }).toString();
      return result.includes('pg_dump');
    } catch (error) {
      return false;
    }
  }

  //주기마다 지우기
  private deleteOldBackups() {
    const files = fs.readdirSync(this.BACKUP_DIR);

    files.forEach(file => {
      const filePath = path.join(this.BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      const fileAgeInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

      if (fileAgeInDays > this.RETENTION_DAYS) {
        fs.unlinkSync(filePath);
        this.logger.log(`Backup file older than ${this.RETENTION_DAYS} days deleted: ${file}`);
      }
    });
  }
}