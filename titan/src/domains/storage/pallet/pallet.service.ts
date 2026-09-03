import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { PalletRepository } from './repositories/pallet.repository';
import { plainToInstance } from 'class-transformer';
import { FilteringPalletDto } from './dto/request/filtering-pallet.dto';
import { PalletResponseDto } from './dto/response/pallet-response.dto';
import { Pallet } from './entities/pallet.entity';

@Injectable()
export class PalletService {
    private readonly logger = new Logger(PalletService.name)
    constructor(
    private readonly palletRepository: PalletRepository,
  ) {}

  async getPalletList(filter : FilteringPalletDto = new FilteringPalletDto()): Promise<PalletResponseDto[]> {
    const palletList = await this.palletRepository.getFilteredList({ filter: filter });
    if (!palletList) {
      this.logger.warn(`Pallet not found`);
      throw new NotFoundException(`Pallet not found`);
    }
    const result = plainToInstance(PalletResponseDto, palletList, { excludeExtraneousValues: true });
    return result;
  }

  async getPalletEntityList(filter : FilteringPalletDto = new FilteringPalletDto()): Promise<Pallet[]> {
    const palletList = await this.palletRepository.getFilteredList({ filter: filter });
    if (!palletList) {
      this.logger.warn(`Pallet not found`);
      throw new NotFoundException(`Pallet not found`);
    }
    return palletList;
  }

  async getPalletById(palletId: number): Promise<PalletResponseDto> {
    const filterDto = new FilteringPalletDto();
    filterDto.palletId = palletId;
    const pallet = await this.palletRepository.getFilteredOne({ filter: filterDto });
    if (!pallet) {
      this.logger.warn(`pallet with ID ${palletId} not found`);
      throw new NotFoundException(`pallet with ID ${palletId} not found`);
    }
    const result = plainToInstance(PalletResponseDto, pallet, { excludeExtraneousValues: true });
    return result;
  }

  async getPalletEntityById(palletId: number): Promise<Pallet> {
    const filterDto = new FilteringPalletDto();
    filterDto.palletId = palletId;
    const pallet = await this.palletRepository.getFilteredOne({ filter: filterDto });
    if (!pallet) {
      this.logger.warn(`pallet with ID ${palletId} not found`);
      throw new NotFoundException(`pallet with ID ${palletId} not found`);
    }
    return pallet;
  }
}