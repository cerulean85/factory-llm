# Titan WAS API Specification (Full)

이 문서는 Titan WAS 시스템의 전체 도메인별 API 명세 및 상세 데이터 정의를 포함합니다.

## 1. 공통 사양
- **Base URL**: `http://[hostname]:3300/`
- **Authentication**: JWT (Bearer Token)
- **Response Format**: 모든 응답은 `ResponseInterceptor`를 통해 표준화된 JSON 형식으로 전달됩니다.
  - `{ "isSuccess": true, "message": "...", "data": { ... } }`

---

## 2. 실시간 모니터링 뷰 (Monitoring Views)

설비 및 창고의 현재 상태를 실시간으로 조회하는 API입니다.

### 2.1 셀 상태 조회 (Cell View)
- **Endpoint**: `GET /cell-view` (또는 `/gantry-cell-view`, `/crane-cell-view`)
- **Response (`CellViewResponseDto`)**:
  | 필드명 | 타입 | 설명 |
  | :--- | :--- | :--- |
  | `warehouseId` | `number` | 소속 창고 ID |
  | `palletId` | `number` | 현재 위치한 팔레트 ID |
  | `locX, Y, Z` | `number` | 셀의 3차원 좌표 |
  | `cellStatus` | `Enum` | 셀 상태 (NORMAL, ERROR, DISABLE 등) |
  | `skuKey` | `string` | 적재된 품목 키 |
  | `stCount` | `number` | 적재 수량 |
  | `luggageFlag` | `boolean` | 화물 유무 |
  | `batchNumber` | `string` | 배치 번호 |
  | `orderNumber` | `string` | 오더 번호 |

---

## 3. 작업 이력 관리 (Job History)

설비(Gantry, Crane)에서 수행된 모든 작업 기록을 관리합니다.

### 3.1 작업 이력 필터링 조회
- **Endpoint**: `POST /job-history/get-filtered-job-history`
- **Request Body (`FilteringJobHistoryDto`)**:
  | 필드명 | 타입 | 설명 |
  | :--- | :--- | :--- |
  | `jobStartDate` | `Date` | 조회 시작일 (YYYY-MM-DD) |
  | `jobEndDate` | `Date` | 조회 종료일 (YYYY-MM-DD) |
  | `taskType` | `Enum` | 작업 유형 (IN, OUT, MOVE) |
  | `workingStatus`| `Enum` | 작업 상태 (COMPLETE, WORKING, CANCEL) |
  | `skuKey` | `string` | 특정 품목 키 필터링 |
  | `palletId` | `number` | 특정 팔레트 필터링 |

---

## 4. 사용자 관리 (Users)

### 4.1 회원가입 및 보안
- **회원가입**: `POST /users/signup` (ID, PW, 이름, 이메일, 소속 등 입력)
- **로그인**: `POST /users/login` (JWT 발급)
- **비밀번호 관리**: `PATCH /users/temp-password` (임시 비밀번호 발급)

---

## 5. 알람 관리 (Alarm)

### 5.1 알람 이력 조회
- **Endpoint**: `POST /alarm-history/get-paginated-alarm-history`
- **주요 필터**: `alarmStartDate`, `alarmEndDate`, `alarmTypeList` (EQUIPMENT, INVENTORY, PALLET), `processType` (조치 여부)

---

## 6. 설비 및 창고 (Equipment & Warehouse)

### 6.1 설비 상태
- **설비 목록**: `POST /equipment/get-equipment-list-with-type`
- **가동 이력**: `GET /equipment-operation-history` - 설비별 런타임 및 가동률 데이터

### 6.2 창고 정보
- **창고 관리**: `GET /warehouse/get-all-warehouse` - 등록된 모든 창고(Gantry 창고, Crane 창고 등) 정보

---

## 7. 시스템 서비스 (Core Services)
- **SSE (Real-time Events)**: `/sse` 엔드포인트를 통해 서버 푸시 알림 수신.
- **Noti**: `GET /noti` - 공지사항 및 시스템 알림 조회.
- **External**: 메일(`mail/send`) 및 SMS(`sms/send`) 발송 기능.
