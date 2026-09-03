export enum WAREHOUSE_TYPE{
  CRANE = 'CRANE',
  GANTRY = 'GANTRY',
  ETC = 'ETC',
  GTR = "GTR"
}

export enum OPERATION_STATUS {
  START = 'START',
  STOP = 'STOP',
  FAULT = 'FAULT',
  UNKNOWN = 'UNKNOWN',
}

export enum OPERATION_MAINTENANCE_TYPE {
  DEFAULT = 'DEFAULT',
  PM = 'PM',                          // Preventive Maintenance
  SCHEDULED_STOP = 'SCHEDULED_STOP',  // 계획정지
  INSPECTION = 'INSPECTION',          // 점검
  REPAIR = 'REPAIR',                  // 고장수리
  ETC = 'ETC',                        // 기타
}

export enum TASK_TYPE {
  NONE = 'NONE',
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  MOVE = 'MOVE',
}

export enum CELL_USE_TYPE {
  NORMAL = 'NORMAL',               // 정상 (사용)
  SHIPPING = 'SHIPPING',           // 입-출고중
  RESERVED = 'RESERVED',           // 예약중
  MODIFYING = 'MODIFYING',         // 수정중
  UNSHIPPED = 'UNSHIPPED',         // 공출고
  DOUBLE_STOCK = 'DOUBLE_STOCK',   // 이중출고
  CHECK_STOCK = 'CHECK_STOCK',     // 재고확인, 사용금지
}

export enum TWIN_STATUS {
  DEFAULT = 'DEFAULT',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum ACTION_TYPE {
  NONE = 'NONE',
  MOVE_HORIZONTAL = 'MOVE_HORIZONTAL',
  MOVE_VERTICAL = 'MOVE_VERTICAL',
  UNLOAD = 'UNLOAD',
  LOAD = 'LOAD',
}

export enum WORKING_STATUS {
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
  NONE = 'NONE',
}

export enum EQUIPMENT_TYPE {
  CNV = 'CNV',  //컨베이어
  RGV = 'RGV',  //RGV
  STC = 'STC',  //스토커크레인
  GTR = 'GTR',  //겐트리
  NONE = 'NONE',
}