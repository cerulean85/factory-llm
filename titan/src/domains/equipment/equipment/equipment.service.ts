import { Logger, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EquipmentRepository } from './repositories/equipment.repository';
import { CreateEquipmentDto } from './dto/request/create-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { plainToInstance } from 'class-transformer';
import { EquipmentResponseDto } from './dto/response/equipment-response.dto';
import { FilteringEquipmentDto } from './dto/request/filtering-equipment.dto';
import { EquipmentTypeService } from '../equipment-type/equipment-type.service';
import { WarehouseService } from 'src/domains/storage/warehouse/warehouse.service';


@Injectable()
export class EquipmentService {
  private readonly logger = new Logger(EquipmentService.name)

  constructor(
    private readonly equipmentRepository: EquipmentRepository,
    private readonly equipmentTypeService: EquipmentTypeService,
    private readonly warehouseService: WarehouseService,
  ) {}

  async createEquipment(createEquipmentDto: CreateEquipmentDto) {
    const equipmentType = await this.equipmentTypeService.getEquipmentTypeById(createEquipmentDto.equipment_type_id);
    const warehouse = await this.warehouseService.getWarehouseById(createEquipmentDto.warehouse_id);
    const newEquipment = await this.equipmentRepository.createEquipment(equipmentType, warehouse, createEquipmentDto);
    return newEquipment;
  }

  async findAllEquipment(): Promise<EquipmentResponseDto[]>{
    const equipmentList = await this.equipmentRepository.getFilteredList();
    if (!equipmentList){
      this.logger.warn(`Equipment not found`);
      throw new NotFoundException(`Equipment not found`);
    };
    const result = plainToInstance(EquipmentResponseDto, equipmentList, { excludeExtraneousValues: true });
    return result;
  }


  async getFilteredEquipmentEntities(filter : FilteringEquipmentDto = new FilteringEquipmentDto()): Promise<Equipment[]>{
    const equipmentList = await this.equipmentRepository.getFilteredList({filter});
    if (!equipmentList){
      this.logger.warn(`Equipment not found`);
      throw new NotFoundException(`Equipment not found`);
    };
    return equipmentList;
  }

  async getEquipmentById(equipmentId: number): Promise<Equipment> {
    if (equipmentId === undefined || equipmentId === null) {
      this.logger.warn(`Invalid equipmentId: ${equipmentId}`);
      throw new BadRequestException(`Invalid equipmentId: ${equipmentId}`);
    }

    const filterDto = new FilteringEquipmentDto();
    filterDto.equipmentId = equipmentId;
    const equipment = await this.equipmentRepository.getFilteredOne({ filter: filterDto });
    if (!equipment) {
      this.logger.warn(`Equipment not found : ${equipmentId}`);
      throw new NotFoundException(`Equipment not found : ${equipmentId}`);
    };
    return equipment;
  }

  async getEquipmentByName(equipmentName: string): Promise<Equipment> {
    if (equipmentName === undefined || equipmentName === null) {
      this.logger.warn(`Invalid equipmentName: ${equipmentName}`);
      throw new BadRequestException(`Invalid equipmentName: ${equipmentName}`);
    }

    const filterDto = new FilteringEquipmentDto();
    filterDto.equipmentName = equipmentName;
    const equipment = await this.equipmentRepository.getFilteredOne({ filter: filterDto });
    if (!equipment) {
      this.logger.warn(`Equipment not found : ${equipmentName}`);
      throw new NotFoundException(`Equipment not found : ${equipmentName}`);
    };
    return equipment;
  }

  async softDeleteEquipmentById(equipmentId: number): Promise<ResponseStatusDto>{
    const result = await this.equipmentRepository.softDeleteEquipmentById(equipmentId);
    if(!result){
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`Equipment with ID ${equipmentId} not found`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = true;
    return resStatusDto;
  }
}