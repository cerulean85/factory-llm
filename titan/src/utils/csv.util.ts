import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import * as csv from 'csv-parser';
import { DateTimeSplit } from './date-transform.util';
import * as path from 'path';
import { createObjectCsvStringifier } from 'csv-writer';
import { Logger } from '@nestjs/common';

export function readCsvToObject(filePath: string): Promise<any[]> {
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(iconv.decodeStream('utf8'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

export async function arrayToCsv(fileName: string, flattenedErrorList: any[]) {
  const logger = new Logger("arrayToCsv");
  const timestamp = DateTimeSplit(new Date()).replace(/[:.\s]/g, '-');
  const csvFilename = `${fileName}-errors-${timestamp}.csv`;
  const filepath = path.join(process.cwd(), 'failed-data', csvFilename);

  try{
    const logDir = path.dirname(filepath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const headers = [] as { id: string, title: string }[];

    if (flattenedErrorList.length > 0) {
      Object.keys(flattenedErrorList[0]).forEach(key => {
        headers.push({ id: key, title: key });
      });
    }

    const csvStringifier = createObjectCsvStringifier({ header: headers });
    const bom = '\uFEFF';
    const csvContent = bom + csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(flattenedErrorList);
    fs.writeFileSync(filepath, csvContent);
    logger.warn(`Saved ${fileName} error records to ${filepath}`);
  } catch (error){
    logger.fatal(`Fail to save ${fileName} error records to ${filepath}`, error);
    throw error;
  }
}