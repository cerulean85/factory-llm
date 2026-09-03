export const backupConfig = {
  backupDirPath: process.env.BACKUP_DIR_PATH || '',          //default : path.join(__dirname, '..', 'backups');
  retentionDays: Number(process.env.BACKUP_RETENTION_DAYS) || 30,    //백업파일 보관 기간
  minute: Number(process.env.BACKUP_MINUTE) || 0,            //(0 - 59) 초과 ? 59, 미만 ? * 처리
  hour: Number(process.env.BACKUP_HOUR) || 0,              //(0 - 23) 초과 ? 23, 미만 ? * 처리
  dayOfMonth: Number(process.env.BACKUP_DAY_OF_MONTH) || -1,       //(1 - 31) 초과 ? 31, 미만 ? * 처리
  month: Number(process.env.BACKUP_MONTH) || -1,            //(1 - 12) 초과 ? 12, 미만 ? * 처리
  dayOfWeek: Number(process.env.BACKUP_DAY_OF_WEEK) || -1,        //(0 - 6) 초과 ? 6, 미만 ? * 처리
} as const