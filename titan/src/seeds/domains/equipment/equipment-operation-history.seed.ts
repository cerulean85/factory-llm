import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { EquipmentOperationHistory } from 'src/domains/equipment/equipment-operation-history/entities/equipment-operation-history.entity';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { getRandomDateWithinLastTwoMonths, rand } from 'src/utils/dummy.util';
import { start } from 'repl';
import { OPERATION_STATUS } from 'src/common/enum/equipment.enum';

function getDummyHistory(
  createCount: number = 100,
  equipmentList
): EquipmentOperationHistory[] {
  let count = 0;
  const targets: EquipmentOperationHistory[] = [];
  let baseDate = getRandomDateWithinLastTwoMonths(); // 초기 기준 날짜 생성

  for (let i = 0; i < createCount; i++) {
    const equipment = equipmentList[rand(1, equipmentList.length - 1)]; // 무작위 설비 선택

    // '가동 시작' 레코드 생성
    const startRecord = new EquipmentOperationHistory();
    startRecord.equipment = equipment;
    startRecord.operation_status = OPERATION_STATUS.START
    startRecord.create_date = baseDate;
    startRecord.description = '가동 시작_test';
    targets.push(startRecord);

    // 랜덤하게 '고장 발생' -> '복구 완료' 추가
    const includeFailure = rand(0, 1) === 1; // 50% 확률로 결정
    if (includeFailure) {
      // '고장 발생' 레코드 생성
      const failureRecord = new EquipmentOperationHistory();
      failureRecord.equipment = equipment;
      failureRecord.operation_status = OPERATION_STATUS.FAULT
      failureRecord.description = '장애 발생_test';
      failureRecord.create_date = new Date(baseDate.getTime() + rand(1, 60) * 60 * 1000); // 1~60분 후
      targets.push(failureRecord);

      // // '복구 완료' 레코드 생성
      // const recoveryRecord = new EquipmentOperationHistory();
      // recoveryRecord.equipment = equipment;
      // recoveryRecord.operation_status = 'RECOVERED';
      // recoveryRecord.description = '장애 복구_test';
      // recoveryRecord.create_date = new Date(failureRecord.create_date.getTime() + rand(1, 60) * 60 * 1000); // 1~60분 후
      // targets.push(recoveryRecord);

      // // 기준 날짜를 '복구 완료' 이후로 업데이트
      // baseDate = new Date(recoveryRecord.create_date.getTime() + rand(1, 60) * 60 * 1000); // 1~60분 후
    } else {
      // 기준 날짜를 '가동 시작' 이후로 업데이트
      baseDate = new Date(baseDate.getTime() + rand(1, 120) * 60 * 1000); // 1~120분 후
    }

    // '가동 중단' 레코드 생성
    const stopRecord = new EquipmentOperationHistory();
    stopRecord.equipment = equipment;
    stopRecord.operation_status = OPERATION_STATUS.STOP
    stopRecord.create_date = baseDate;
    stopRecord.description = '가동 중단_test';
    targets.push(stopRecord);

    // 기준 날짜를 '가동 중단' 이후로 업데이트
    baseDate = new Date(baseDate.getTime() + rand(1, 120) * 60 * 1000); // 1~120분 후

    count++;
  }

  return targets;
}

@Injectable()
export class EquipmentOperationHistorySeed implements ISeeder {
    private readonly logger = new Logger(EquipmentOperationHistorySeed.name)
    constructor(
    @InjectRepository(EquipmentOperationHistory)
    private readonly equipmentOperationHistoryRepo: Repository<EquipmentOperationHistory>,
    @InjectRepository(Equipment)
    private readonly equipmentRepo: Repository<Equipment>,
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.equipmentOperationHistoryRepo.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No EquipmentOperationHistory found, inserting debug data...');

    const equipmentList = await this.equipmentRepo.find();
    if (!equipmentList) {
      this.logger.log('No foreign key exists for the EquipmentOperationHistory');
      return;
    }

    const testData = getDummyHistory(500, equipmentList);

    const BATCH_SIZE = 1000;

    for (let i = 0; i < testData.length; i += BATCH_SIZE) {
      const batch = testData.slice(i, i + BATCH_SIZE);
      await this.equipmentOperationHistoryRepo.save(batch);
    }

    //await this.equipmentOperationHistoryRepo.save(targetRecords);
    this.logger.log('Debug data inserted!');
  }
}
