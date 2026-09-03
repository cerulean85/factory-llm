import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CraneCellRepository } from './repositories/crane-cell.repository';
import { CraneCellResponseDto } from './dto/response/crane-cell-response.dto';
import { UpdateCraneCellDto } from './dto/request/update-crane-cell.dto';
import { FilteringCraneCellDto } from './dto/request/filtering-crane-cell.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { plainToInstance } from 'class-transformer';
import { CraneCell } from './entities/crane-cell.entity';

@Injectable()
export class CraneCellService {
  private readonly logger = new Logger(CraneCellService.name)
  constructor(
    private readonly craneCellRepository: CraneCellRepository,
  ) {}

  async getCraneCellList(filteringCraneCellDto: FilteringCraneCellDto): Promise<CraneCellResponseDto[]> {
    const craneCellList = await this.craneCellRepository.getFilteredList({
      filter: filteringCraneCellDto,
    });
    if (!craneCellList) {
      this.logger.warn(`CraneCell not found`);
      throw new NotFoundException(`CraneCell not found`);
    }
    const result = plainToInstance(CraneCellResponseDto, craneCellList, { excludeExtraneousValues: true });
    return result;
  }

  async getCraneCellEntityList(filteringCraneCellDto: FilteringCraneCellDto = new FilteringCraneCellDto()): Promise<CraneCell[]> {
    const craneCellList = await this.craneCellRepository.getFilteredList({
      filter: filteringCraneCellDto,
    });
    if (!craneCellList) {
      this.logger.warn(`CraneCell not found`);
      throw new NotFoundException(`CraneCell not found`);
    }
    return craneCellList;
  }

  async getCraneCellById(craneCellId: number): Promise<CraneCellResponseDto> {
    const filterDto = new FilteringCraneCellDto();
    filterDto.craneCellId = craneCellId;
    const craneCell = await this.craneCellRepository.getFilteredOne({ filter: filterDto });
    if (!craneCell) {
      this.logger.warn(`CraneCell with id ${craneCellId} not found`);
      throw new NotFoundException(`CraneCell with id ${craneCellId} not found`);
    }
    const result = plainToInstance(CraneCellResponseDto, craneCell, { excludeExtraneousValues: true });
    return result;
  }

  async getCraneCellEntityById(craneCellId: number): Promise<CraneCell> {
    const filterDto = new FilteringCraneCellDto();
    filterDto.craneCellId = craneCellId;
    const craneCell = await this.craneCellRepository.getFilteredOne({ filter: filterDto });
    if (!craneCell) {
      this.logger.warn(`CraneCell with id ${craneCellId} not found`);
      throw new NotFoundException(`CraneCell with id ${craneCellId} not found`);
    }
    return craneCell;
  }

  async updateCraneCell(craneCellId : number, dto : UpdateCraneCellDto): Promise<ResponseStatusDto> {
    const filterDto = new FilteringCraneCellDto();
    filterDto.craneCellId = craneCellId;
    const craneCell = await this.craneCellRepository.getFilteredOne({ filter: filterDto });
    if (!craneCell) {
      this.logger.warn(`CraneCell with id ${craneCellId} not found`);
      throw new NotFoundException(`CraneCell with id ${craneCellId} not found`);
    }
    const result = await this.craneCellRepository.updateCraneCell(craneCell, dto);
    if (!result) {
      this.logger.warn(`Failed to update CraneCell with id ${craneCellId}`);
      throw new InternalServerErrorException(`Failed to update CraneCell with id ${craneCellId}`);
    }
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'CraneCell updated successfully.' : 'Failed to update CraneCell.';
    return resStatusDto;
  }
};