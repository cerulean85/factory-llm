import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GantryCellRepository } from './repositories/gantry-cell.repository';
import { GantryCell } from './entities/gantry-cell.entity';
import { UpdateGantryCellDto } from './dto/request/update-gantry-cell.dto';
import { FilteringGantryCellDto } from './dto/request/filtering-gantry-cell.dto';
import { plainToInstance } from 'class-transformer';
import { GantryCellResponseDto } from './dto/response/gantry-cell-response.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

@Injectable()
export class GantryCellService {
  private readonly logger = new Logger(GantryCellService.name)
  constructor(
    private readonly gantryCellRepository: GantryCellRepository,
  ) {}

  async findEntitiesBeforeStockInDate(date: Date): Promise<GantryCell[]> {
    const filterDto = new FilteringGantryCellDto();
    filterDto.endDate = date;
    const list = await this.gantryCellRepository.getFilteredList({ filter: filterDto });
    return list;
  }

  async getGantryCellList(filter : FilteringGantryCellDto = new FilteringGantryCellDto()): Promise<GantryCellResponseDto[]> {
    const gantryCellList = await this.gantryCellRepository.getFilteredList({ filter: filter });
    if (!gantryCellList) {
      this.logger.warn(`GantryCell not found`);
      throw new NotFoundException(`GantryCell not found`);
    }
    const result = plainToInstance(GantryCellResponseDto, gantryCellList, { excludeExtraneousValues: true });
    return result;
  }

  async getGantryCellEntityList(filterDto : FilteringGantryCellDto = new FilteringGantryCellDto()): Promise<GantryCell[]> {
    const gantryCellList = await this.gantryCellRepository.getFilteredList({ filter: filterDto });
    if (!gantryCellList) {
      this.logger.warn(`GantryCell not found`);
      throw new NotFoundException(`GantryCell not found`);
    }
    return gantryCellList;
  }

  async getGantryCellById(id: number): Promise<GantryCellResponseDto> {
    const filterDto = new FilteringGantryCellDto();
    filterDto.gantryCellId = id;
    const gantryCell = await this.gantryCellRepository.getFilteredOne({ filter: filterDto });
    if (!gantryCell) {
      this.logger.warn(`GantryCell with id ${id} not found`);
      throw new NotFoundException(`GantryCell with id ${id} not found`);
    }
    const result = plainToInstance(GantryCellResponseDto, gantryCell, { excludeExtraneousValues: true });
    return result;
  }

  async getGantryCellEntityById(id: number): Promise<GantryCell> {
    const filterDto = new FilteringGantryCellDto();
    filterDto.gantryCellId = id;
    const gantryCell = await this.gantryCellRepository.getFilteredOne({ filter: filterDto });
    if (!gantryCell) {
      this.logger.warn(`GantryCell with id ${id} not found`);
      throw new NotFoundException(`GantryCell with id ${id} not found`);
    }
    return gantryCell;
  }

  async updateGantryCell(gantryCellId : number, dto : UpdateGantryCellDto): Promise<ResponseStatusDto> {
    const filterDto = new FilteringGantryCellDto();
    filterDto.gantryCellId = gantryCellId;
    const gantryCell = await this.gantryCellRepository.getFilteredOne({ filter: filterDto });
    if (!gantryCell) {
      this.logger.warn(`GantryCell with id ${gantryCellId} not found`);
      throw new NotFoundException(`GantryCell with id ${gantryCellId} not found`);
    }
    const result = await this.gantryCellRepository.updateGantryCell(gantryCell, dto);
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'GantryCell updated successfully.' : 'Failed to update GantryCell.';
    return resStatusDto;
  }
};