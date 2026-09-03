import { SetMetadata } from '@nestjs/common';

export const RETURN_DTO = 'return_dto';
export const ReturnDto = (dto: any) => SetMetadata(RETURN_DTO, dto);