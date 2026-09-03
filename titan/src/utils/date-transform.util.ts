export function DateTimeSplitWithMs(date: Date | string): string {
  const dt = typeof date === 'string' ? new Date(date) : date;

  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');

  const hh = String(dt.getHours()).padStart(2, '0');
  const mi = String(dt.getMinutes()).padStart(2, '0');
  const ss = String(dt.getSeconds()).padStart(2, '0');
  const ff = String(dt.getMilliseconds()).padStart(3, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${ff}`;
}

export function DateTimeSplit(date: Date | string): string {
  const dt = typeof date === 'string' ? new Date(date) : date;

  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');

  const hh = String(dt.getHours()).padStart(2, '0');
  const mi = String(dt.getMinutes()).padStart(2, '0');
  const ss = String(dt.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export function DateTimeMinSplit(date: Date | string): string {
  const dt = typeof date === 'string' ? new Date(date) : date;

  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');

  const hh = String(dt.getHours()).padStart(2, '0');
  const mi = String(dt.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

export function DateDaySplit(date: Date | string): string {  // YYYY-MM-DD 형식 [시스템기준]
  const dt = typeof date === 'string' ? new Date(date) : date;

  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');  // 0-based
  const dd = String(dt.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

export function InitStartOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  );
}

export function InitEndOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23, 59, 59, 59
  );
}