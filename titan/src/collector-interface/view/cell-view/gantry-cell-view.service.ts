import { Logger, Injectable } from '@nestjs/common';
import { CellStackedCountsDto } from './dto/response/cell-stacked-counts.dto';
import { GantryCellViewStatsRepository } from './repositories/gantry-cell-view.stats.repository';
import { parsePgTextArray, toNum } from 'src/utils/database.util';

@Injectable()
export class GantryCellViewService {
  private readonly logger = new Logger(GantryCellViewService.name)
  
  constructor(
    private readonly gantryCellViewStatsRepository: GantryCellViewStatsRepository,
  ) {}


  // warehouseId별 그룹화 및 적치 가능/적치/미적치/금지/체크/적치율 현황 개수 집계
  async getCurrentGantryCountsByWarehouse(): Promise<CellStackedCountsDto[]> {
    const rows = await this.gantryCellViewStatsRepository.getCurrentGantryCountsByWarehouse();
    const result = rows.map((row) => {
      const types = parsePgTextArray(row.standard_type_list);
      return {
        warehouseId: Number(row.warehouse_id),
        stackAreaCode: row.warehouse_code,
        currentCount: toNum(row.current),
        totalCount: toNum(row.enabled),
        disabledCount: toNum(row.disabled),
        emptyCellCount: toNum(row.unassigned),
        standardTypes: types,
        standardTypeCount: types.length,
      };
    });

    return result as CellStackedCountsDto[];
  }
}