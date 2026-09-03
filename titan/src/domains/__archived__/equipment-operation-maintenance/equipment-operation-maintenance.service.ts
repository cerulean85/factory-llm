import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EquipmentService } from '../../equipment/equipment/equipment.service';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { EquipmentResponseDto } from '../../equipment/equipment/dto/response/equipment-response.dto';
import { EquipmentOperationMaintenanceRepository } from './repositories/equipment-operation-maintenance.repository';
import { CreateEquipmentOperationMaintenanceDto } from './dto/request/create-equipment-operation-maintenance.dto';
import { EquipmentOperationMaintenance } from './entities/equipment-operation-maintenance.entity';
import { FilteringEquipmentOperationMaintenanceDto } from './dto/request/filtering-equipment-operation-maintenance.dto';
import { EquipmentOperationMaintenanceResponseDto } from './dto/response/equipment-operation-maintenance-response.dto';
import { Pagination } from 'src/utils/pagination.util';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { EquipmentOperationMaintenanceAggregationDto } from './dto/response/equipment-operation-maintenance-aggregation.dto';
import { UpdateEquipmentOperationMaintenanceDto } from './dto/request/update-equipment-operation-maintenance.dto';
import { EquipmentOperationMaintenanceOrderKey } from './repositories/equipment-operation-maintenance.base.repository';
import { FilteringEquipmentDto } from 'src/domains/equipment/equipment/dto/request/filtering-equipment.dto';
import { EQUIPMENT_TYPE } from 'src/common/enum/equipment.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EquipmentOperationMaintenanceService {
  private readonly logger = new Logger(EquipmentOperationMaintenanceService.name)
  constructor(
    private readonly eomRepository: EquipmentOperationMaintenanceRepository,
    private readonly equipmentService: EquipmentService
  ) {}

  async createOperationMaintenance(dto: CreateEquipmentOperationMaintenanceDto) : Promise<EquipmentOperationMaintenance>{
    const {
      equipment_id: equipmentId,
    } = dto;

    const equipment = await this.equipmentService.getEquipmentById(equipmentId) ?? undefined;
    if (!equipment) {
      this.logger.warn(`Equipment not found : ${equipmentId}`);
      throw new NotFoundException(`Equipment not found : ${equipmentId}`);
    };


    const newEquipment = await this.eomRepository.createEquipmentOperationMaintenance(equipment, dto);
    return newEquipment;
  }

  async getPaginatedData(reqFilter: FilteringEquipmentOperationMaintenanceDto): Promise<PaginationResponseDto<EquipmentOperationMaintenanceResponseDto>> {
    const result = await this.eomRepository.getFilteredPaginatedList({filter : reqFilter});
    const pagiResult = Pagination.transformPaginatedData(EquipmentOperationMaintenanceResponseDto, reqFilter, result);
    return pagiResult;
  };

  async updateEquipmentOperationMaintenance(equipmentOperationMaintenanceId: number, dto: UpdateEquipmentOperationMaintenanceDto): Promise<ResponseStatusDto> {
    const filterDto = new FilteringEquipmentOperationMaintenanceDto();
    filterDto.equipmentOperationMaintenanceId = equipmentOperationMaintenanceId;
    const emoEntity = await this.eomRepository.getFilteredOne({filter: filterDto});
    if (!emoEntity) {
      this.logger.warn(`EquipmentOperationMaintenance not found : ${equipmentOperationMaintenanceId}`);
      throw new NotFoundException(`EquipmentOperationMaintenance not found : ${equipmentOperationMaintenanceId}`);
    }
    const result = await this.eomRepository.updateEquipmentOperationMaintenance(emoEntity, dto);
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'EquipmentOperationMaintenance updated successfully.' : 'Failed to update EquipmentOperationMaintenance.';
    return resStatusDto;
  }

  async getAggregation(startDate:Date, endDate:Date) : Promise<EquipmentOperationMaintenanceAggregationDto[]> {

    //1. 파라미터를 데이터를 초기화 한다.
    const equipOperAggDtoList: EquipmentOperationMaintenanceAggregationDto[] = [];
    
    const filter = new FilteringEquipmentOperationMaintenanceDto();
    filter.startDate = startDate;
    filter.endDate = endDate

    //2. 필터링된 가동률 이력 데이터를 가져온다.
    const histories = await this.eomRepository.getFilteredList({
      filter: filter, 
      orderMap : {
        [EquipmentOperationMaintenanceOrderKey.ID] : ORDER.ASC,
        [EquipmentOperationMaintenanceOrderKey.CREATE_DATE] : ORDER.ASC
      }
    });
    
    //3. 그룹핑해서 데이터 집계를 위한 자료구조를 만든다.
    const groupedEom = new Map<number, EquipmentOperationMaintenance[]>();
    for (const current of histories) {
      const equipmentId = current.equipment.id;
      if (!groupedEom.has(equipmentId)) {
        groupedEom.set(equipmentId, []);
      }
      groupedEom.get(equipmentId)!.push(current);
    }

    //4. 기간 내에 이력 없는 장비들을 초기화한다.
    const equipFilter = new FilteringEquipmentDto();
    equipFilter.equipmentTypeNameList = [EQUIPMENT_TYPE.GTR, EQUIPMENT_TYPE.STC, EQUIPMENT_TYPE.RGV];
    const equipmentEntities = await this.equipmentService.getFilteredEquipmentEntities(equipFilter);

    //const allEquipments = await this.equipmentService.findAllEquipment();
    const allEquipments = await plainToInstance(EquipmentResponseDto, equipmentEntities, { excludeExtraneousValues: true });

    //5. 그룹화된 자료구조를 기반으로 집계 DTO를 생성한다.
    for (const [equipmentId, eomList] of groupedEom.entries()) {
      const aggDto = await this.makeAggregation(eomList);
      equipOperAggDtoList.push(aggDto);
    }

    //6. 가동 이력이 없는 설비들의 빈값을 채워준다.
    for (const equipment of allEquipments) {
      if(equipOperAggDtoList.some(dto => dto.equipmentId === equipment.equipmentId)) {
        continue;
      } else {
        const aggDto = await this.createDefaultAggDto(equipment);
        equipOperAggDtoList.push(aggDto);
      }
    }

    //7. 데이터 정렬 후 리턴한다.
    equipOperAggDtoList.sort((a, b) => a.equipmentId - b.equipmentId);
    return equipOperAggDtoList;

  }
  
  // 기본 집계 DTO를 생성
  private async createDefaultAggDto(equipment: EquipmentResponseDto): Promise<EquipmentOperationMaintenanceAggregationDto> {

    const dto = new EquipmentOperationMaintenanceAggregationDto();
    dto.equipmentId = equipment.equipmentId;
    dto.equipmentName = equipment.equipmentName;
    dto.equipmentTypeId = equipment.equipmentTypeId;
    dto.equipmentTypeName = equipment.equipmentTypeName;

    return dto;
  }


  // 가동률 집계 함수를 만든다.
  private async makeAggregation(eomEntityList: EquipmentOperationMaintenance[]): Promise<EquipmentOperationMaintenanceAggregationDto> {
   if (eomEntityList.length < 1) {
      this.logger.warn(`Not enough data to calculate aggregation: ${eomEntityList.length}`);
      return new EquipmentOperationMaintenanceAggregationDto();
    }

    const eqOpHistAgg = new EquipmentOperationMaintenanceAggregationDto();


    for (let i = 0; i < eomEntityList.length; i++) {
      let current = eomEntityList[i];
      eqOpHistAgg.maintenanceDetailList.push({
        startDate: current.start_date,
        endDate: current.end_date,
        createDate: current.create_date,
        operationMaintenanceType: current.operation_maintenance_type,
        durationMin: Math.floor((current.end_date.getTime() - current.start_date.getTime()) / (1000 * 60)),
        description: current.description
      })
    }

    //5. 값을 할당해준다.
    const baseEomEntity = eomEntityList[0];
    eqOpHistAgg.equipmentId = baseEomEntity.equipment.id;
    eqOpHistAgg.equipmentName = baseEomEntity.equipment.name;
    eqOpHistAgg.equipmentTypeId = baseEomEntity.equipment.equipment_type.id;
    eqOpHistAgg.equipmentTypeName = baseEomEntity.equipment.equipment_type.name;

    return eqOpHistAgg;
  }
};