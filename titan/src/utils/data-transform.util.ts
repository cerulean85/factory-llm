
//string -> enum함수
export function strToEnum<T extends Record<string, string>>(
  value: unknown,       //변환할 값
  EnumType: T,          //변환할 enumType
  fallback: T[keyof T]  //실패 시, 리턴 할 default값
): T[keyof T] {
  if (typeof value === 'string') {
    const enumValues = Object.values(EnumType) as Array<T[keyof T]>;
    if (enumValues.includes(value as T[keyof T])) {
      return value as T[keyof T];
    }
  }
  return fallback;
}