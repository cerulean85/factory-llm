# Titan WAS Database Schema Specification

이 문서는 Titan WAS 시스템의 엔티티 분석을 통해 도출된 데이터베이스 스키마 명세입니다.

---

## 1. 사용자 및 권한 (User & Auth)

시스템 접근 제어 및 사용자 정보를 관리하는 테이블군입니다.

### 1.1 `users` (사용자 마스터)
| 컬럼명 | 타입 | 제약조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `seq_id` | `int` | PK, AI | 고유 시퀀스 번호 |
| `user_id` | `varchar(20)` | Unique, Not Null | 로그인 ID |
| `password` | `varchar` | Not Null | 암호화된 비밀번호 |
| `name` | `varchar(30)` | Not Null | 사용자 실명 |
| `email` | `varchar(50)` | Nullable | 이메일 주소 |
| `phone_number`| `varchar(20)` | Nullable | 연락처 |
| `affiliation` | `varchar(50)` | Nullable | 소속 부서/팀 |
| `role_id` | `int` | FK (role.id) | 권한 그룹 참조 |

### 1.2 `role` (권한 그룹)
- `id` (PK), `name` (Admin, Operator 등), `description`

---

## 2. 설비 관리 (Equipment)

현장 설비의 마스터 정보와 가동 상태를 관리합니다.

### 2.1 `equipment` (설비 정보)
| 컬럼명 | 타입 | 제약조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `int` | PK, AI | 설비 고유 ID |
| `code` | `varchar` | Unique | 설비 코드 (예: G01) |
| `name` | `varchar` | Not Null | 설비 명칭 |
| `type_id` | `int` | FK | 설비 유형 (Gantry, Crane 등) |
| `warehouse_id`| `int` | FK | 소속 창고 참조 |

### 2.2 `equipment_operation_history` (가동 이력)
- `id` (PK), `equipment_id` (FK), `status` (RUN, STOP, ERROR), `start_time`, `end_time`

---

## 3. 물류 및 재고 (Logistics & Storage)

창고 구조, 팔레트 위치 및 작업 흐름을 관리하는 핵심 테이블군입니다.

### 3.1 `warehouse` (창고 마스터)
- `id` (PK), `code`, `name`, `type` (GANTRY_STOCK, CRANE_STOCK 등)

### 3.2 `pallet` (팔레트 정보)
- `id` (PK), `rfid_tag`, `status` (EMPTY, LOADED, MOVING)

### 3.3 `cell_view` (창고 셀 상태)
| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `int` | PK |
| `warehouse_id`| `int` | FK (소속 창고) |
| `pallet_id` | `int` | FK (현재 위치한 팔레트) |
| `loc_x, y, z` | `int` | 3차원 좌표 (Bank, Bay, Level) |
| `cell_status` | `varchar` | 셀 상태 (NORMAL, DISABLE, ERROR) |
| `sku_key` | `varchar` | 적재된 품목 코드 |
| `st_count` | `int` | 적재 수량 |
| `luggage_flag`| `boolean` | 화물 존재 여부 |

### 3.4 `job_history` (작업 수행 이력)
| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `int` | PK |
| `task_type` | `varchar` | 작업 종류 (IN, OUT, MOVE) |
| `working_status`| `varchar` | 진행 상태 (WORKING, COMPLETE, CANCEL) |
| `pallet_id` | `int` | 대상 팔레트 참조 |
| `warehouse_id`| `int` | 발생 창고 참조 |
| `sku_key` | `varchar` | 품목 코드 |
| `job_date` | `timestamp` | 작업 수행 시각 |

---

## 4. 알람 시스템 (Alarm)

### 4.1 `alarm` (알람 정의)
- `id` (PK), `code`, `message`, `level` (INFO, WARN, CRITICAL)

### 4.2 `alarm_history` (발생 및 조치 이력)
- `id` (PK), `alarm_id` (FK), `equipment_id` (FK), `occurred_at`, `processed_at`, `process_message`

---

## 5. 핵심 관계 요약 (ERD Summary)
1. **창고 중심**: `Warehouse` 테이블은 `Equipment`, `CellView`, `JobHistory`와 1:N 관계를 맺어 물리적 범위를 정의합니다.
2. **팔레트 중심**: `Pallet`은 `CellView`에서 현재 위치를, `JobHistory`에서 이동 경로를 기록합니다.
3. **사용자-알람**: `AlarmUserRelation`을 통해 특정 알람 발생 시 통지 대상을 관리합니다.
