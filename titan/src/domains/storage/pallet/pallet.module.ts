import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pallet } from './entities/pallet.entity';
import { PalletRepository } from './repositories/pallet.repository';
import { PalletService } from './pallet.service';
import { PalletController } from './pallet.controller';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pallet]),
  ],
  controllers: [PalletController],
  providers: [PalletService, PalletRepository, Pagination],
  exports: [PalletService]
})
export class PalletModule {}