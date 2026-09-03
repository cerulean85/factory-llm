import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { ItemMasterViewService } from './item-master-view.service';
import { FilteringItemMasterViewDto } from './dto/request/filtering-item-master-view.dto';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { ItemMasterViewResponseDto } from './dto/response/item-master-view-response.dto';

@Controller('item-master-view')
export class ItemMasterViewController {
  constructor(
    private readonly itemMasterViewService: ItemMasterViewService,
  ) {}
  @Post('get-all-item-master-view')
  @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(ItemMasterViewResponseDto, '아이템 마스터 뷰', '아이템 마스터 뷰', '아이템 마스터 뷰')
  async getAllItemMasterView(
    @Body() filterDto: FilteringItemMasterViewDto
  ) {
    const result = await this.itemMasterViewService.getItemMasterViewList(filterDto);
    return result;
  }
}