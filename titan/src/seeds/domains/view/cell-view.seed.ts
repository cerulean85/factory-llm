import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { getRandomDateWithinLastYear, rand, stdTypes } from '../../../utils/dummy.util'
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { CellView } from 'src/collector-interface/view/cell-view/entities/cell-view.entity';
import { Pallet } from 'src/domains/storage/pallet/entities/pallet.entity';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';

@Injectable()
export class CellViewSeed implements ISeeder {
  private readonly logger = new Logger(CellViewSeed.name)
  constructor(
  @InjectRepository(Warehouse)
  private readonly warehouseRepository: Repository<Warehouse>,
  @InjectRepository(CellView)
  private readonly cellViewRepository: Repository<CellView>,
  @InjectRepository(Pallet)
  private readonly palletRepository: Repository<Pallet>,

  ) {}
  private loc_all_temp_key = 0;
  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.cellViewRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async createCraneCellList() {
    const craneWarehouse = await this.warehouseRepository.find({ where: { type: WAREHOUSE_TYPE.CRANE } });
    const allPallets = await this.palletRepository.find();
    const availablePallets = [...allPallets];

    const data: Partial<CellView>[] = []; // 배열 초기화
    const maxCount = rand(400, 450); // 400~450개 랜덤 설정
    let count = 0;

    for (let locX = 5; locX <= 8; locX++) {
      for (let locY = 1; locY <= 10; locY++) {
        for (let locZ = 1; locZ <= 10; locZ++) {
          
          // 최대 개수에 도달하면 중단
          if (count >= maxCount) break;

          // 일정 확률로 skip (밀도 조절)
          const skip = rand(0, 3);
          if (skip === 0) continue; // 25% 확률로 skip
          const randomDate = getRandomDateWithinLastYear();

          let cellStatus: CELL_STATUS;
          const cellStatusRandom = rand(0, 3);
          if (cellStatusRandom === 0) {
            cellStatus = CELL_STATUS.IN;
          } else {
            cellStatus = CELL_STATUS.NORMAL;
          }
          const standardType = stdTypes[rand(0, stdTypes.length - 1)];

          let selectedPallet: Pallet | null = null;
          let luggageFlag: boolean = false;
          if (rand(0, 1) === 1 && availablePallets.length > 0) {
            const randomIndex = rand(0, availablePallets.length - 1);
            selectedPallet = availablePallets[randomIndex];
            availablePallets.splice(randomIndex, 1);
            luggageFlag = true;
          }
          this.loc_all_temp_key++;
          data.push({
            warehouse: craneWarehouse[rand(0, craneWarehouse.length - 1)]!,
            pallet: selectedPallet,
            // loc_unit: `000${rand(1, 10).toString().padStart(1, '0')}`,
            loc_unit: `000${rand(1, 5).toString()}`,
            loc_x: locX,
            loc_y: locY,
            loc_z: locZ,
            enable: true,
            cell_status: cellStatus,
            sku_key: luggageFlag ? `Key${rand(1000000000, 9999999999)}` : '',
            standard_type: luggageFlag ? standardType : '',
            st_count: luggageFlag ? rand(0, 20) : 0,
            in_date: randomDate,
            update_date: randomDate,
            luggage_flag: luggageFlag,
            batch_number: `${rand(100000, 999999)}`,
            order_number: `${rand(100000, 999999)}`,
            order_flow: `${rand(100000, 999999)}`,
            loc_all: this.loc_all_temp_key,
          });
          count++;
        }
        if (count >= maxCount) break;
      }
      if (count >= maxCount) break;
    }
    return data;
  }


  async createGantryCellList() {
    const gantryWarehouse = await this.warehouseRepository.find({ where: { type: WAREHOUSE_TYPE.GANTRY } });
    
    const data: Partial<CellView>[] = []; // 배열 초기화
    const maxCount = rand(400, 450); // 400~450개 랜덤 설정
    let count = 0;


    for (let port = 0; port < maxCount; port++) {
      // 최대 개수에 도달하면 중단
      if (count >= maxCount) break;

      // 일정 확률로 skip (밀도 조절)
      const skip = rand(0, 3);
      if (skip === 0) continue; // 25% 확률로 skip
      const randomDate = getRandomDateWithinLastYear();

      let cellStatus: CELL_STATUS;
      const cellStatusRandom = rand(0, 3);
      if (cellStatusRandom === 0) {
        cellStatus = CELL_STATUS.IN;
      } else {
        cellStatus = CELL_STATUS.NORMAL;
      }
      const standardType = stdTypes[rand(0, stdTypes.length - 1)];
      const luggageFlag = rand(0, 1) === 1;
      this.loc_all_temp_key++;
      data.push({
        warehouse: gantryWarehouse[rand(0, gantryWarehouse.length - 1)]!,
        pallet: null,
        loc_x: port,
        loc_y: 0,
        loc_z: 0,
        enable: true,
        cell_status: cellStatus,
        sku_key: luggageFlag ? `Key${rand(1000000000, 9999999999)}` : '',
        standard_type: luggageFlag ? standardType : '',
        st_count: luggageFlag ? rand(0, 20) : 0,
        in_date: randomDate,
        update_date: randomDate,
        luggage_flag: luggageFlag,
        batch_number: `${rand(100000, 999999)}`,
        order_number: `${rand(100000, 999999)}`,
        order_flow: `${rand(100000, 999999)}`,
        loc_all: this.loc_all_temp_key,
      });
      count++;
    }
    return data;
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    const cnt = await this.cellViewRepository.count();

    if (cnt === 0) {
      this.logger.log('No CellView found, inserting debug data...');

      const craneCellList = await this.createCraneCellList();
      const gantryCellList = await this.createGantryCellList();

      const data = [...craneCellList, ...gantryCellList];

      await this.cellViewRepository.insert(data);
      this.logger.log('Debug data inserted!');
    }
  }
}
