# Derived Database Schema

이 문서는 TypeORM 엔티티를 기준으로 역도출한 데이터베이스 스키마다.  
실제 기준은 코드이며, 마이그레이션 SQL이 아니라 엔티티 선언을 신뢰했다.

## Basis

- DBMS: PostgreSQL
- ORM: TypeORM
- 엔티티 로딩: `src/**/*.entity{.ts,.js}`
- 스키마 생성 방식: `DATABASE_SYNCHRONIZE`가 켜져 있으면 entity 기준으로 자동 반영
- 별도 정식 migration 세트는 확인되지 않음

주의:

- 일부 테이블은 "view"라는 이름이지만 TypeORM 엔티티로 관리되는 일반 테이블처럼 취급된다.
- `src/domains/__archived__/**`는 제외했다.
- 엔티티에 `ManyToOne`만 있고 역방향 컬렉션이 없는 관계가 많다.

## Overall Domain Map

핵심 마스터:

- `users`
- `role`
- `equipment_type`
- `warehouse`
- `equipment`
- `pallet`
- `file`
- `setting_system`
- `setting_remote`

업무 이력:

- `login_history`
- `refresh-token`
- `noti`
- `todo`
- `shipping_specification`
- `job_history`
- `equipment_operation_history`

알람:

- `alarm`
- `alarm_user_relation`
- `alarm_history`
- `alarm_history_process_by_user`
- `equipment_alarm_history`
- `inventory_alarm_history`
- `pallet_alarm_history`
- `message_dispatch_history`
- `alarm_queue`

수집/뷰성 테이블:

- `cell_view`
- `dock_view`
- `item_master_view`
- `realtime_equipment_view`
- `job_queue`

## Relationship Summary

- `role.user_seq_id -> users.seq_id`
- `login_history.users_seq_id -> users.seq_id`
- `refresh-token.user_seq_id -> users.seq_id`
- `noti.users_seq_id -> users.seq_id`
- `todo.users_seq_id -> users.seq_id`
- `shipping_specification.users_seq_id -> users.seq_id`
- `setting_remote.seq_id -> users.seq_id`
- `message_dispatch_history.users_seq_id -> users.seq_id`
- `alarm_history_process_by_user.user_seq_id -> users.seq_id`

- `equipment.equipment_type_id -> equipment_type.id`
- `equipment.warehouse_id -> warehouse.id`
- `alarm.equipment_type_id -> equipment_type.id`
- `equipment_operation_history.equipment_id -> equipment.id`
- `alarm_queue.equipment_id -> equipment.id`
- `realtime_equipment_view.equipment_id -> equipment.id`

- `job_history.warehouse_id -> warehouse.id`
- `job_history.pallet_id -> pallet.id`
- `cell_view.warehouse_id -> warehouse.id`
- `cell_view.pallet_id -> pallet.id`
- `job_queue.warehouse_id -> warehouse.id`
- `job_queue.pallet_id -> pallet.id`
- `job_queue.sku_key -> item_master_view.sku_key`

- `alarm_user_relation.alarm_id -> alarm.id`
- `alarm_user_relation.user_seq_id -> users.seq_id`
- `alarm_queue.alarm_id -> alarm.id`
- `equipment_alarm_history.alarm_id -> alarm.id`

- `equipment_alarm_history.alarm_history_id -> alarm_history.id`
- `inventory_alarm_history.alarm_history_id -> alarm_history.id`
- `pallet_alarm_history.alarm_history_id -> alarm_history.id`
- `alarm_history_process_by_user.alarm_history_id -> alarm_history.id`
- `message_dispatch_history.alarm_history_id -> alarm_history.id`

## Table Definitions

### `users`

설명:

- 사용자 마스터

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `seq_id` | int | N | auto increment | PK |
| `user_id` | varchar(30) | N |  | 로그인 ID |
| `password` | varchar | N |  | 저장 전 bcrypt 해시 |
| `email` | varchar(50) | N | `''` |  |
| `name` | varchar(30) | N |  |  |
| `affiliation` | varchar(50) | N | `''` | 소속 |
| `phone_number` | varchar(20) | N | `''` |  |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` | update 시 갱신 |
| `valid_record` | boolean | N | `true` | 소프트 삭제/활성 여부 |
| `blocking` | boolean | N | `false` | 차단 여부 |

인덱스:

- `idx_users_seq_id(seq_id)`

### `role`

설명:

- 사용자 권한

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `type` | varchar(20) | N | `''` | `ROLE_TYPE` 성격 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `description` | varchar(500) | N | `''` |  |
| `user_seq_id` | int | Y |  | FK -> `users.seq_id`, `ON DELETE CASCADE` |

### `login_history`

설명:

- 로그인 시도/성공 이력 저장

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `try_ip` | varchar(30) | N | `''` | 접속 IP |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` | 로그인 시각 |
| `users_seq_id` | int | Y |  | FK -> `users.seq_id`, `ON DELETE CASCADE` |

### `refresh-token`

설명:

- refresh token 저장 테이블

주의:

- 테이블명이 `refresh-token`처럼 하이픈을 포함한다.

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `refresh_token` | varchar | Y | `null` | refresh token 문자열 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `expires_date` | timestamp | N | `CURRENT_TIMESTAMP` | 만료일 |
| `user_seq_id` | int | Y |  | FK -> `users.seq_id`, `ON DELETE CASCADE` |

### `noti`

설명:

- 공지사항

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `title` | varchar(100) | N | `''` | 제목 |
| `content` | text | N | `''` | 본문 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `users_seq_id` | int | Y |  | FK -> `users.seq_id` |

### `todo`

설명:

- 목표/할일 관리

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `standard_type` | varchar(100) | N | `''` | 규격 |
| `target_start_date` | timestamp | N | `CURRENT_TIMESTAMP` | 목표 시작일 |
| `target_end_date` | timestamp | N | `CURRENT_TIMESTAMP` | 목표 종료일 |
| `target_count` | int | N | `0` | 목표량 |
| `description` | text | N | `''` | 설명 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `alarm_offset_hours` | int | N | `1` | 알람 오프셋 |
| `alarm_process_flag` | boolean | N | `false` | 알람 처리 여부 |
| `users_seq_id` | int | Y |  | FK -> `users.seq_id` |

### `equipment_type`

설명:

- 장비 유형 마스터

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `name` | varchar(50) | N | `''` | 유형명 |
| `description` | varchar(500) | N | `''` | 설명 |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `type` | varchar(50) | N | `CNV` | `EQUIPMENT_TYPE` 성격 |

인덱스:

- `idx_equipment_type_id(id)`

### `warehouse`

설명:

- 창고/구역 마스터

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `type` | enum | N | `ETC` | `WAREHOUSE_TYPE` |
| `code` | varchar(50) | N | `''` | 창고 코드 |
| `name` | varchar(50) | N | `''` | 창고명 |

### `equipment`

설명:

- 실제 설비 마스터

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `spec` | varchar(500) | N | `''` | 스펙 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `equipment_type_id` | int | Y |  | FK -> `equipment_type.id`, `ON DELETE CASCADE` |
| `name` | varchar(50) | N | `''` | 설비명 |
| `code` | varchar(50) | N | `''` | unique |
| `warehouse_id` | int | Y |  | FK -> `warehouse.id`, `ON DELETE CASCADE` |

인덱스/제약:

- `idx_equipment_id_type_id(id, equipment_type_id)`
- `code` unique

### `pallet`

설명:

- 팔레트 마스터

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `code` | varchar(50) | N |  | unique, 팔레트 코드/RFID |

### `file`

설명:

- 파일 메타데이터

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `name` | text | N | `''` | 원본 파일명 |
| `stored_name` | text | N | `''` | 저장 파일명 |
| `path` | text | N | `''` | 저장 경로 |

### `shipping_specification`

설명:

- 중점 출고 규격

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `standard_type` | varchar(100) | N | `''` | 규격 |
| `users_seq_id` | int | Y |  | FK -> `users.seq_id` |

### `setting_remote`

설명:

- 사용자별 원격 접속 정보

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `location` | varchar(50) | N | `''` | 위치명 |
| `ip` | varchar(20) | N | `''` | IP |
| `port` | int | N | `1` | 포트 |
| `seq_id` | int | Y |  | FK -> `users.seq_id`, `ON DELETE CASCADE` |

### `setting_system`

설명:

- 시스템 전역 설정

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `alarm_send_enabled` | boolean | N | `true` | 전체 알람 전송 |
| `equipment_alarm_enabled` | boolean | N | `true` | 설비 알람 전송 |
| `inventory_alarm_enabled` | boolean | N | `true` | 재고 알람 전송 |
| `inventory_alarm_remaining_day` | int | N | `-1` | 장기재고 기준일 |
| `load_warning_ratio_crane` | int | N | `-1` | 크레인 경고 비율 |
| `load_danger_ratio_crane` | int | N | `-1` | 크레인 위험 비율 |
| `load_warning_color_crane` | varchar | N | `''` | 크레인 경고 색상 |
| `load_danger_color_crane` | varchar | N | `''` | 크레인 위험 색상 |
| `load_warning_ratio_gantry` | int | N | `-1` | 갠트리 경고 비율 |
| `load_danger_ratio_gantry` | int | N | `-1` | 갠트리 위험 비율 |
| `load_warning_color_gantry` | varchar | N | `''` | 갠트리 경고 색상 |
| `load_danger_color_gantry` | varchar | N | `''` | 갠트리 위험 색상 |
| `refresh_browser` | boolean | N | `false` | 브라우저 강제 새로고침 |

### `alarm`

설명:

- 알람 정의 마스터

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `code` | varchar(50) | N | `''` | 알람 코드 |
| `type` | varchar(50) | N | `EQUIPMENT` | `ALARM_HISTORY_TYPE` 성격 |
| `description` | varchar(500) | N | `''` | 설명 |
| `importance` | int | N | `1` | 중요도 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `process_method` | varchar(500) | N | `''` | 조치 방법 |
| `file_id_list` | int[] | Y | `[]` | 파일 ID 배열 |
| `valid_record` | boolean | N | `true` | 활성 여부 |
| `send_enabled` | boolean | N | `false` | 발송 여부 |
| `reset_available` | boolean | N | `false` | 리셋 가능 여부 |
| `equipment_type_id` | int | Y |  | FK -> `equipment_type.id` |

인덱스:

- `idx_alarm_id_equipment_type_id(id, equipment_type_id)`

### `alarm_user_relation`

설명:

- 알람 담당자 매핑 N:M 브릿지

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `user_seq_id` | int | N |  | FK -> `users.seq_id`, `ON DELETE CASCADE` |
| `alarm_id` | int | N |  | FK -> `alarm.id`, `ON DELETE CASCADE` |

인덱스:

- `idx_alarm_user_relation_alarm_id(alarm_id)`
- `idx_alarm_user_relation_user_seq_id(user_seq_id)`

### `alarm_history`

설명:

- 알람 발생/조치 상위 이력

특징:

- 세부 이력은 타입별 하위 테이블로 분리됨

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` | 발생 시각 |
| `update_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `process_date` | timestamp | Y |  | 조치 시각 |
| `message` | varchar(500) | Y | `''` | 알람 메시지 |
| `process_message` | varchar(300) | N | `''` | 조치 내용 |
| `type` | varchar(10) | N | `EQUIPMENT` | `ALARM_HISTORY_TYPE` |

인덱스:

- `idx_alarm_type_date(type, create_date)`

### `alarm_history_process_by_user`

설명:

- 알람 이력과 조치 사용자 N:M 브릿지

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `user_seq_id` | int | N |  | FK -> `users.seq_id`, `ON DELETE CASCADE` |
| `alarm_history_id` | int | N |  | FK -> `alarm_history.id`, `ON DELETE CASCADE` |

인덱스:

- `idx_ahpbu_alarm_history_id(alarm_history_id)`
- `idx_ahpbu_user_seq_id(user_seq_id)`

### `equipment_alarm_history`

설명:

- 설비 알람 전용 하위 이력

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `alarm_id` | int | N |  | FK -> `alarm.id` |
| `alarm_history_id` | int | N |  | FK -> `alarm_history.id` |
| `equipment_name` | varchar(50) | N |  | 설비명 스냅샷 |
| `equipment_code` | varchar(50) | N |  | 설비코드 스냅샷 |

인덱스:

- `idx_ea_alarm_history_id(alarm_history_id)`

### `inventory_alarm_history`

설명:

- 재고/장기재고 알람 전용 하위 이력

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `alarm_history_id` | int | N |  | FK -> `alarm_history.id` |
| `standard_type` | varchar(100) | N |  | 규격 |
| `stored_item_count` | int | N |  | 재고수 |
| `inventory_alarm_type` | enum | N | `STORED` | `INVENTORY_ALARM_TYPE` |
| `alert_type` | enum | N | `WARNING` | `ALERT_TYPE` |
| `warehouse_name` | varchar(50) | N |  | 창고명 스냅샷 |
| `warehouse_code` | varchar(50) | N |  | 창고코드 스냅샷 |
| `warehouse_type` | enum | N | `ETC` | `WAREHOUSE_TYPE` |

인덱스:

- `idx_ia_alarm_history_id(alarm_history_id)`

### `pallet_alarm_history`

설명:

- 팔레트 관련 하위 알람 이력

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `alarm_history_id` | int | N |  | FK -> `alarm_history.id` |
| `warning_count` | int | N |  | 경고 개수 |

인덱스:

- `idx_pa_alarm_history_id(alarm_history_id)`

### `message_dispatch_history`

설명:

- 알람 관련 메시지 발송 이력

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `type` | varchar(20) | N | `SMS` | `SEND_MESSAGE_TYPE` 성격 |
| `message` | varchar(500) | N | `''` | 발송 내용 |
| `dispatch_success` | boolean | N | `true` | 발송 성공 여부 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `alarm_history_id` | int | N |  | FK -> `alarm_history.id` |
| `users_seq_id` | int | N |  | FK -> `users.seq_id` |

### `alarm_queue`

설명:

- 외부/수집 이벤트를 처리하기 전 임시 알람 큐

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `alarm_id` | int | N |  | FK -> `alarm.id`, `ON DELETE CASCADE` |
| `equipment_id` | int | N |  | FK -> `equipment.id`, `ON DELETE CASCADE` |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `process_status` | int | N | `1` | 코드 주석상 `0 완료 / 1 발생` |

### `equipment_operation_history`

설명:

- 설비 가동/정지/고장 이력

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `equipment_id` | int | N |  | FK -> `equipment.id` |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` | 발생 시각 |
| `operation_status` | varchar(20) | N |  | `OPERATION_STATUS` |
| `operation_maintenance_type` | varchar(20) | N |  | `OPERATION_MAINTENANCE_TYPE` |
| `description` | varchar(500) | N |  | 설명 |

인덱스:

- `idx_equipment_id(equipment_id)`
- `idx_create_date(create_date)`
- `idx_equipment_create_date(equipment_id, create_date)`

### `job_history`

설명:

- 입고/출고/이동 작업 이력

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `pallet_id` | int | Y |  | FK -> `pallet.id` |
| `warehouse_id` | int | N |  | FK -> `warehouse.id` |
| `sku_key` | varchar(20) | N | `''` | 품목키 |
| `standard_type` | varchar(100) | N | `''` | 규격 |
| `working_status` | varchar(10) | N | `COMPLETE` | `WORKING_STATUS` |
| `st_count` | int | N | `-1` | 수량 |
| `loc_raw` | varchar(20) | N | `''` | 위치 문자열 |
| `task_type` | varchar(10) | N | `NONE` | `TASK_TYPE` |
| `batch_number` | varchar(10) | N | `''` |  |
| `order_number` | varchar(20) | N | `''` |  |
| `order_flow` | varchar(10) | N | `''` |  |
| `job_date` | timestamp | N | `CURRENT_TIMESTAMP` | 작업 시각 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` | 생성 시각 |

### `cell_view`

설명:

- 셀 적치 현황 스냅샷 테이블

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `warehouse_id` | int | N |  | FK -> `warehouse.id` |
| `pallet_id` | int | Y |  | FK -> `pallet.id` |
| `loc_x` | int | Y | `-1` | bank |
| `loc_y` | int | Y | `-1` | bay |
| `loc_z` | int | Y | `-1` | level |
| `enable` | boolean | N | `true` | 사용 여부 |
| `cell_status` | varchar(30) | N |  | `CELL_STATUS` |
| `sku_key` | varchar(30) | Y |  |  |
| `standard_type` | varchar(100) | Y |  |  |
| `st_count` | int | Y | `-1` | 수량 |
| `in_date` | timestamp | Y | `CURRENT_TIMESTAMP` | 입고일 |
| `update_date` | timestamp | Y | `CURRENT_TIMESTAMP` |  |
| `luggage_flag` | boolean | N | `false` | 화물 존재 여부 |
| `batch_number` | varchar(30) | Y |  |  |
| `order_number` | varchar(30) | Y |  |  |
| `order_flow` | varchar(10) | Y |  |  |
| `loc_all` | varchar(50) | N |  | unique |
| `loc_unit` | varchar(50) | Y |  |  |

인덱스/제약:

- `idx_cell_view_pallet(pallet_id)`
- `loc_all` unique

### `dock_view`

설명:

- 도크별 출하 현황 스냅샷

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `dock_no` | int | N | `-1` | 도크 번호 |
| `gantry_code` | int | N | `-1` | 갠트리 코드 |
| `status` | varchar(30) | N | `''` | 출고 상태 |
| `shipment_order` | int | N | `-1` | ERP 오더 번호 |
| `container_no` | varchar(30) | N | `''` | 컨테이너 번호 |
| `unit_order_count` | int | N | `-1` | 한 오더 내 건수 |
| `order_count` | int | N | `-1` | 오더 수량 |
| `outing_count` | int | N | `-1` | 출고 중 수량 |
| `in_gantry_count` | int | N | `-1` | 갠트리 내부 수량 |
| `conveyor_count` | int | N | `-1` | 컨베이어 수량 |
| `completion_count` | int | N | `-1` | 완료 수량 |
| `remand_count` | int | N | `-1` | 보류 수량 |
| `bad_count` | int | N | `-1` | 불량 수량 |

### `item_master_view`

설명:

- 품목 마스터

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `sku_key` | varchar(20) | N |  | PK, unique |
| `standard_type` | varchar(100) | N |  | 규격 |

### `realtime_equipment_view`

설명:

- 설비 실시간 상태 스냅샷

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `equipment_id` | int | N |  | FK -> `equipment.id` |
| `speed` | int | Y | `-1` | 속도 |
| `status` | varchar(20) | Y | `''` | `OPERATION_STATUS` |
| `loc_x` | int | Y | `0` | 위치 x |
| `loc_y` | int | Y | `0` | 위치 y |
| `loc_z` | int | Y | `0` | 위치 z |
| `task_type` | varchar(20) | Y |  | `TASK_TYPE` |
| `standard_type` | varchar(100) | Y |  | 적재 규격 |
| `st_count` | int | Y | `0` | 수량 |
| `create_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |
| `twin_status` | varchar(20) | Y | `DEFAULT` | `TWIN_STATUS` |
| `loaded` | boolean | Y | `false` | 적재 여부 |
| `action_type` | varchar(30) | Y | `NONE` | `ACTION_TYPE` |

### `job_queue`

설명:

- 수집/처리 전 작업 큐

컬럼:

| 컬럼명 | 타입 | null | 기본값 | 제약/설명 |
| --- | --- | --- | --- | --- |
| `id` | int | N | auto increment | PK |
| `warehouse_id` | int | N |  | FK -> `warehouse.id` |
| `pallet_id` | int | N |  | FK -> `pallet.id` |
| `sku_key` | varchar(20) | Y |  | FK -> `item_master_view.sku_key` |
| `working_status` | varchar(10) | Y | `''` |  |
| `st_count` | int | Y | `0` |  |
| `loc_raw` | varchar(20) | Y | `''` |  |
| `task_type` | varchar(10) | Y | `''` |  |
| `batch_number` | varchar(10) | Y | `''` |  |
| `order_number` | varchar(20) | Y | `''` |  |
| `order_flow` | varchar(10) | Y | `''` |  |
| `job_date` | timestamp | N | `CURRENT_TIMESTAMP` |  |

## Enum-Like Columns

코드상 enum 성격 컬럼의 대표 값:

- `ROLE_TYPE`: `''`, `ADMIN`
- `WAREHOUSE_TYPE`: `CRANE`, `GANTRY`, `ETC`, `GTR`
- `EQUIPMENT_TYPE`: `CNV`, `RGV`, `STC`, `GTR`, `NONE`
- `OPERATION_STATUS`: `START`, `STOP`, `FAULT`, `UNKNOWN`
- `OPERATION_MAINTENANCE_TYPE`: `DEFAULT`, `PM`, `SCHEDULED_STOP`, `INSPECTION`, `REPAIR`, `ETC`
- `TASK_TYPE`: `NONE`, `INPUT`, `OUTPUT`, `MOVE`
- `WORKING_STATUS`: `COMPLETE`, `CANCEL`, `NONE`
- `ACTION_TYPE`: `NONE`, `MOVE_HORIZONTAL`, `MOVE_VERTICAL`, `UNLOAD`, `LOAD`
- `TWIN_STATUS`: `DEFAULT`, `LEFT`, `RIGHT`
- `ALARM_HISTORY_TYPE`: `EQUIPMENT`, `INVENTORY`, `PALLET`
- `ALARM_HISTORY_PROCESS_FLAG`: `A`, `Y`, `N`
- `INVENTORY_ALARM_TYPE`: `STORED`, `LONG_TERM`, `ETC`
- `ALERT_TYPE`: `WARNING`, `DANGER`
- `SEND_MESSAGE_TYPE`: `SMS`, `SNS`, `EMAIL`
- `CELL_STATUS`: `0`, `1`, `2`, `5`, `6`

## Schema Characteristics

- 소프트 삭제는 별도 deleted_at 컬럼이 아니라 주로 `valid_record boolean`으로 처리한다.
- 감사 컬럼은 대부분 `create_date`, `update_date` 패턴이다.
- 브릿지 테이블:
  - `alarm_user_relation`
  - `alarm_history_process_by_user`
- 배열 컬럼:
  - `alarm.file_id_list int[]`
- 스냅샷/뷰성 테이블:
  - `cell_view`
  - `dock_view`
  - `realtime_equipment_view`
  - `item_master_view`
- 하위 세부 테이블로 분기되는 상위 이력:
  - `alarm_history` -> `equipment_alarm_history | inventory_alarm_history | pallet_alarm_history`

## Notable Risks / Ambiguities

- 엔티티 기준 도출이라 실제 운영 DB의 인덱스/제약이 100% 동일하다고 보장할 수는 없다.
- `DATABASE_SYNCHRONIZE` 설정에 의존하면 환경별 스키마 차이가 생길 수 있다.
- 일부 enum 컬럼은 PostgreSQL native enum이고, 일부는 단순 `varchar`에 enum 값을 저장한다.
- `job_queue`와 `item_master_view` 관계는 `sku_key` 문자열 기반 FK로 보인다.
