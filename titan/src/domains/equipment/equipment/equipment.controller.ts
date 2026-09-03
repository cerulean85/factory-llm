import { Controller, Post, UseGuards } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { EquipmentTypeResponseDto } from '../equipment-type/dto/reponse/equipment-type-response.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService,
  ) {}

  @Post('get-equipment-list-with-type')
  @UseGuards(JwtServiceAuthGuard)
  @ApiPaginatedReturn(
    EquipmentTypeResponseDto
    , "모든 장비 유형 조회"
    , "등록된 모든 장비 유형 조회"
    , "모든 장비 내역"
  )
  async getEquipmentListWithType(
  ) {
      const findedData =  await this.equipmentService.findAllEquipment();
      return findedData;
  }
}