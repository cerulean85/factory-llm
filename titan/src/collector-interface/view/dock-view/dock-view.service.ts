import { Logger, Injectable } from '@nestjs/common';
import { DockViewRepository } from './repositories/dock-view.repository';
import { DockViewResponseDto } from './dto/response/dock-view-response.dto';
import { plainToInstance } from 'class-transformer';
import { FilteringDockViewDto } from './dto/request/filtering-dock-view.dto';

@Injectable()
export class DockViewService {
  private readonly logger = new Logger(DockViewService.name)
  
  constructor(
    private readonly dockViewRepository: DockViewRepository,
  ) {
  }

  async getDockList(filterDto: FilteringDockViewDto): Promise<DockViewResponseDto[]> {
    const dockViewData = await this.dockViewRepository.getFilteredList({ filter: filterDto });
    const result = plainToInstance(DockViewResponseDto, dockViewData, { excludeExtraneousValues: true });
    return result;
  }

  async getDockById(filterDto: FilteringDockViewDto): Promise<DockViewResponseDto> {
    const dockViewData = await this.dockViewRepository.getFilteredOne({ filter: filterDto });
    const result = plainToInstance(DockViewResponseDto, dockViewData, { excludeExtraneousValues: true });
    return result;
  }
}