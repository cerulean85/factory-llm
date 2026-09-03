import { Logger } from "@nestjs/common";
import { DateTimeSplitWithMs } from "./date-transform.util";
import * as path from 'path';
import * as fs from 'fs';

export async function arrayToJsonFile(
  name: string,
  rows: any[],
) {
  const logger = new Logger('writeErrorsAsJsonArray');
  const timestamp = DateTimeSplitWithMs(new Date()).replace(/[:.\s]/g, '-');
  const fileName = `${name}-errors-${timestamp}.json`;
  const filePath = path.join(process.cwd(), 'failed-data', fileName);

  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, safeStringify(rows), 'utf8');
    logger.warn(`Saved JSON errors to ${filePath}`);
    return filePath;
  } catch (e) {
    logger.error(`Failed to write JSON errors: ${filePath}`, e as any);
    throw e;
  }
}

function safeStringify(obj: any): string {
  const seen = new WeakSet();
  const replacer = (_key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    if (value instanceof Error) {
      return {
        stack: value.stack,
        ...value,
      };
    }
    if (typeof value === 'bigint') return value.toString();
    if (value instanceof Date) return value.toISOString();
    // undefined → null (빠짐 방지)
    if (value === undefined) return null;
    return value;
  };
  return JSON.stringify(obj, replacer, 2);
}
