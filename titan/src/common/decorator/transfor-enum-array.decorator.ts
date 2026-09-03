import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

//소문자가 와도 대문자로 처리
//"equipment, inventory..." 이런식의 콤마형태로 와도 처리
export function TransformEnumArray(enumType: object) {
  const enumValues = Object.values(enumType).map(v => String(v).toUpperCase());

  return Transform(({ value }) => {
    let values: string[];

    if (typeof value === 'string') {
      // 'equipment,inventory'
      values = value.split(',').map(v => v.trim().toUpperCase());
    } else if (Array.isArray(value)) {
      // ['equipment', 'inventory']
      values = value.map(v => String(v).toUpperCase());
    } else {
      throw new BadRequestException('Invalid input format for enum array');
    }

    const invalid = values.filter(v => !enumValues.includes(v));
    if (invalid.length > 0) {
      throw new BadRequestException(`Invalid enum values: ${invalid.join(', ')}`);
    }

    return values;
  });
}