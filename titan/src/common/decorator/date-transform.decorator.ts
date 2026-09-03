import { Transform } from 'class-transformer';
import { ValidateIf, IsDate } from 'class-validator';

export function DateTransform() {
  return function (target: any, propertyKey: string) {
    Transform(({ value }) => {
      if (value === '' || value === null || value === undefined) {
        return undefined;
      }
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    })(target, propertyKey);

    ValidateIf((value) => value !== undefined && value !== null)(target, propertyKey);
    IsDate()(target, propertyKey);
  };
}