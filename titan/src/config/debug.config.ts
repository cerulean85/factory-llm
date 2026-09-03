import { envToBool } from "src/utils/env.util";

export const DEBUG_JWT_ENABLED                  = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_JWT_ENABLED); //JWT 인증 활성화 여부
export const DEBUG_GRPC_STREAMING_ENABLED       = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_GRPC_STREAMING_ENABLED); //GRPC 스트리밍 여부
export const DEBUG_EMAIL                        = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_EMAIL); //메일 전송 여부
export const DEBUG_QUEUE_TABLE_SEARCH           = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_QUEUE_TABLE_SEARCH); // 테이블 서칭 여부 
export const DEBUG_INSERT_DATA                  = process.env.NODE_ENV === 'production' ? false : envToBool(process.env.DEBUG_INSERT_DATA); // 테스트 데이터 삽입 여부
export const DEBUG_LONG_TERM_INVENTORY_ALARM    = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_LONG_TERM_INVENTORY_ALARM); // 장기재고 알람 여부
export const DEBUG_TODO_SEARCH                  = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_TODO_SEARCH); // 주기적 todo search 여부
export const DEBUG_MIDDLEWARE                   = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_MIDDLEWARE); // 디버그용 미들웨어 사용 여부   
export const DEBUG_SIMULATOR                    = process.env.NODE_ENV === 'production' ? false : envToBool(process.env.DEBUG_SIMULATOR); // 시뮬레이터 사용 여부
export const DEBUG_SMS                          = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_SMS); // SMS 전송 여부
export const DEBUG_VIEW_TABLE_SEARCH             = process.env.NODE_ENV === 'production' ? true : envToBool(process.env.DEBUG_VIEW_TABLE_SEARCH); // 실시간 뷰 스케줄링 여부