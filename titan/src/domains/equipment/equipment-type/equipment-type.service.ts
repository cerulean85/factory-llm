import { Logger, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EquipmentType } from './entities/equipment-type.entity';
import { EquipmentTypeRepository } from './repositories/equipment-type.repository';
import { CreateEquipmentTypeDto } from './dto/request/create-equipment-type.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { FilteringEquipmentTypeDto } from './dto/request/filtering-equipment-type.dto';


@Injectable()
export class EquipmentTypeService {
  private readonly logger = new Logger(EquipmentTypeService.name)

  constructor(
    private readonly equipmentTypeRepository: EquipmentTypeRepository,

  ) {}

  async createEquipmentType(createEquipmentTypeDto: CreateEquipmentTypeDto) {
    const newEquipmentType = await this.equipmentTypeRepository.createEquipmentType(createEquipmentTypeDto);
    return newEquipmentType;
  }

  async findAllEquipmentType(): Promise<EquipmentType[]>{
    const equipmentTypeList = await this.equipmentTypeRepository.getFilteredList();
    if (!equipmentTypeList){
      this.logger.warn(`EquipmentType not found`);
      throw new NotFoundException(`EquipmentType not found`);
    };
    return equipmentTypeList;
  }

  async getEquipmentTypeById(equipmentTypeId: number): Promise<EquipmentType> {
    if (equipmentTypeId === undefined || equipmentTypeId === null) {
      this.logger.warn(`Invalid equipmentTypeId: ${equipmentTypeId}`);
      throw new BadRequestException(`Invalid equipmentTypeId: ${equipmentTypeId}`);
    }

    const filterDto = new FilteringEquipmentTypeDto();
    filterDto.equipmentTypeId = equipmentTypeId;
    const equipmentType = await this.equipmentTypeRepository.getFilteredOne({ filter: filterDto });
    if (!equipmentType) {
      this.logger.warn(`EquipmentType not found : ${equipmentTypeId}`);
      throw new NotFoundException(`EquipmentType not found : ${equipmentTypeId}`);
    };
    return equipmentType;
  }

  async getEquipmentTypeByName(equipmentTypeName: string): Promise<EquipmentType> {
    if (equipmentTypeName === undefined || equipmentTypeName === null) {
      this.logger.warn(`Invalid equipmentTypeId: ${equipmentTypeName}`);
      throw new BadRequestException(`Invalid equipmentTypeId: ${equipmentTypeName}`);
    }

    const filterDto = new FilteringEquipmentTypeDto();
    filterDto.equipmentTypeName = equipmentTypeName;
    const equipmentType = await this.equipmentTypeRepository.getFilteredOne({ filter: filterDto });
    if (!equipmentType) {
      this.logger.warn(`EquipmentType not found : ${equipmentTypeName}`);
      throw new NotFoundException(`EquipmentType not found : ${equipmentTypeName}`);
    };
    return equipmentType;
  }

  async softDeleteEquipmentTypeById(equipmentTypeId: number): Promise<ResponseStatusDto>{
    const result = await this.equipmentTypeRepository.softDeleteEquipmentTypeById(equipmentTypeId);
    if(!result){
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`EquipmentType with ID ${equipmentTypeId} not found`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = true;
    return resStatusDto;
  }
}