import { PartialType } from '@nestjs/swagger';
import { CreateShippingSpecificationDto } from './create-shipping-specification.dto';

export class UpdateShippingSpecificationDto extends PartialType(CreateShippingSpecificationDto) {} 