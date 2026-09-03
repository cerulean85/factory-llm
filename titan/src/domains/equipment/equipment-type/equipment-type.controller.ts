import { Controller, Post, UseGuards } from '@nestjs/common';
import { EquipmentTypeService } from './equipment-type.service';
import { plainToInstance } from 'class-transformer';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { EquipmentTypeResponseDto } from './dto/reponse/equipment-type-response.dto';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';

@Controller('equipment-type')
export class EquipmentTypeController {
  constructor(
    private readonly equipmentTypeService: EquipmentTypeService,
  ) {}

    @Post('get-all-equipment-type')
    @UseGuards(JwtServiceAuthGuard)
    @ApiReturn(
      EquipmentTypeResponseDto
      , "모든 장비 유형 조회"
      , "등록된 모든 장비 유형 조회"
      , "모든 장비 내역"
    )
    async getAllEquipmentType(
    ) {
        const findedData =  await this.equipmentTypeService.findAllEquipmentType();
        const result = plainToInstance(EquipmentTypeResponseDto, findedData, { excludeExtraneousValues: true });
        return result;
    }
}