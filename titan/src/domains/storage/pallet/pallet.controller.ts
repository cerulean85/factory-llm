import { Controller } from '@nestjs/common';
import { PalletService } from './pallet.service';

@Controller('pallet')
export class PalletController {
  constructor(
    private readonly palletService: PalletService,
  ) {}

}