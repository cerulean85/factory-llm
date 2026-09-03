# API 명세서 (Warehouse Automation System)

---

## 공통 규칙

### 인증
- `Authorization: Bearer {accessToken}` 헤더 필요 (인증: O 표시 엔드포인트)

### 공통 응답 DTO

```
ResponseStatusDto
  isSuccess   boolean   성공 여부
  message     string    상태 메시지

PaginationResponseDto<T>
  data        T[]       결과 배열
  total       number    전체 개수
  totalPages  number    전체 페이지 수
  currentPage number    현재 페이지

CursorResponseDto<T>
  data        T[]       결과 배열
  total       number    전체 개수
  cursor      number    기준 커서 ID
  hasMore     boolean   다음 데이터 여부
```

### Enum 정의

| Enum | 값 |
|------|----|
| `ALARM_HISTORY_TYPE` | `EQUIPMENT`, `INVENTORY`, `PALLET` |
| `ALARM_HISTORY_PROCESS_FLAG` | `A`(전체), `Y`(처리됨), `N`(미처리) |
| `ROLE_TYPE` | `DEFAULT` 외 |
| `EQUIPMENT_TYPE` | `CNV`, `RGV`, `CRANE`, `GANTRY` 외 |
| `WAREHOUSE_TYPE` | `ETC` 외 |
| `TASK_TYPE` | `IN`(입고), `OUT`(출고), `MOVE`(이동), `NONE` |
| `WORKING_STATUS` | (코드 정의 참고) |
| `OPERATION_STATUS` | (코드 정의 참고) |
| `OPERATION_MAINTENANCE_TYPE` | `DEFAULT` 외 |

---

## 1. 사용자 관리

### `GET /users` — 사용자 목록 조회 (인증: O)

**Input (Query)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| page | number | 선택 | 기본:1, min:1 | 페이지 번호 |
| limit | number | 선택 | 기본:10, min:1, max:100 | 페이지 크기 |
| startDate | Date | 선택 | | 조회 시작일 |
| endDate | Date | 선택 | | 조회 종료일 |
| keyword | string | 선택 | length:1-100 | 검색 키워드 |
| seqId | number | 선택 | | 사용자 SEQ ID |
| seqIdList | number[] | 선택 | | SEQ ID 리스트 |
| userId | string | 선택 | | 사용자 ID |
| email | string | 선택 | | 이메일 |
| phoneNumber | string | 선택 | | 전화번호 |
| validRecord | boolean | 선택 | 기본:true | 탈퇴 여부 |

**Output** `PaginationResponseDto<UsersResponseDto>`
| 필드 | 타입 | 설명 |
|------|------|------|
| userSeqId | number | 사용자 SEQ ID |
| userId | string | 사용자 아이디 |
| name | string | 이름 |
| phoneNumber | string | 전화번호 |
| email | string | 이메일 |
| affiliation | string | 소속 |
| createDate | Date | 생성일 |
| updateDate | Date | 수정일 |

---

### `GET /users/check` — ID 중복 확인 (인증: X)

**Input (Query)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| userId | string | 필수 | 확인할 사용자 ID |

**Output** `ResponseStatusDto`

---

### `GET /users/:seqId` — 특정 사용자 조회 (인증: O)

**Input (Path)**
| 필드 | 타입 | 설명 |
|------|------|------|
| seqId | number | 사용자 SEQ ID |

**Output** `UsersResponseDto`

---

### `POST /users/signup` — 회원가입 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| user_id | string | 필수 | length:1-20 | 로그인 ID |
| password | string | 필수 | length:8-16, 특수문자 1개 이상, 연속동일문자 3개 미만 | 비밀번호 |
| email | string | 선택 | isEmail, max:50 | 이메일 |
| name | string | 필수 | length:1-30 | 이름 |
| affiliation | string | 선택 | length:1-50 | 소속 |
| phone_number | string | 선택 | 10-12자리 숫자 | 전화번호 |

**Output** `UsersResponseDto`

---

### `POST /users/login` — 로그인 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| userId | string | 필수 | 로그인 ID |
| password | string | 필수 | 비밀번호 |

**Output** `LoginResponseDto`
| 필드 | 타입 | 설명 |
|------|------|------|
| userSeqId | number | 사용자 SEQ ID |
| accessToken | string | JWT Access Token |
| refreshToken | string | JWT Refresh Token |

---

### `POST /users/id` — 아이디 찾기 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| emailOrPhoneNumber | string | 필수 | 이메일 또는 전화번호 |

**Output** `FindedUserIdResponseDto`

---

### `POST /users/send-code` — 이메일 인증코드 발송 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | 필수 | 인증코드 수신 이메일 |

**Output** `string`

---

### `POST /users/confirm-code` — 이메일 인증코드 확인 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | 필수 | 이메일 |
| code | string | 필수 | 인증코드 |

**Output** `ResponseStatusDto`

---

### `POST /users/:seqId/logout` — 로그아웃 (인증: O)

**Input (Path)**
| 필드 | 타입 | 설명 |
|------|------|------|
| seqId | number | 사용자 SEQ ID |

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| refreshToken | string | 필수 | Refresh Token |

**Output** `ResponseStatusDto`

---

### `POST /users/:seqId/validate-password` — 비밀번호 확인 (인증: O)

**Input (Path)** `seqId: number`

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| password | string | 필수 | 비밀번호 |

**Output** `ResponseStatusDto`

---

### `PATCH /users/unblock` — 차단 해제 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| userId | string | 필수 | 사용자 ID |
| password | string | 필수 | 비밀번호 |

**Output** `ResponseStatusDto`

---

### `PATCH /users/:seqId/info` — 회원정보 수정 (인증: O)

**Input (Path)** `seqId: number`

**Input (Body)** *(모두 선택)*
| 필드 | 타입 | 조건 | 설명 |
|------|------|------|------|
| password | string | length:8-16, 특수문자 1개 이상 | 비밀번호 |
| name | string | length:1-30 | 이름 |
| phone_number | string | | 전화번호 |
| affiliation | string | length:1-50 | 소속 |
| email | string | isEmail, max:50 | 이메일 |

**Output** `ResponseStatusDto`

---

### `PATCH /users/:seqId/refresh` — Access Token 재발급 (인증: X)

**Input (Path)** `seqId: number`

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| refreshToken | string | 필수 | Refresh Token |

**Output** `AccessTokenResponseDto`
| 필드 | 타입 | 설명 |
|------|------|------|
| accessToken | string | 새 Access Token |

---

### `PATCH /users/temp-password` — 임시 비밀번호 발급 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| userId | string | 필수 | 사용자 ID |
| email | string | 필수 | 이메일 |

**Output** `ResponseStatusDto`

---

### `PATCH /users/:seqId/block` — 사용자 차단 (인증: O)

**Input (Path)** `seqId: number`

**Output** `ResponseStatusDto`

---

### `DELETE /users/:seqId/soft` — 사용자 비활성화 (인증: O)

**Input (Path)** `seqId: number`

**Output** `ResponseStatusDto`

---

## 2. 권한 관리

### `GET /users/:userSeqId/role` — 사용자 권한 조회 (인증: O)

**Input (Path)** `userSeqId: number`

**Output** `RoleResponseDto[]`
| 필드 | 타입 | 설명 |
|------|------|------|
| roleId | number | 권한 ID |
| type | ROLE_TYPE | 권한 유형 |
| userSeqId | number | 사용자 SEQ ID |
| userId | string | 사용자 ID |
| userName | string | 사용자 이름 |
| createDate | Date | 생성일 |
| updateDate | Date | 수정일 |

---

### `POST /users/:userSeqId/role` — 권한 추가 (인증: O)

**Input (Path)** `userSeqId: number`

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| type | ROLE_TYPE | 필수 | isEnum, 기본:DEFAULT | 권한 유형 |
| description | string | 선택 | length:0-500 | 상세 내역 |

**Output** `RoleResponseDto`

---

### `DELETE /users/:userSeqId/role/:roleId/soft` — 특정 권한 삭제 (인증: O)

**Input (Path)** `userSeqId: number`, `roleId: number`

**Output** `ResponseStatusDto`

---

### `DELETE /users/:userSeqId/role/soft` — 모든 권한 삭제 (인증: O)

**Input (Path)** `userSeqId: number`

**Output** `ResponseStatusDto`

---

## 3. 로그인 이력

### `POST /history/get-all-login-history` — 전체 로그인 이력 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| page | number | 선택 | | 페이지 번호 |
| limit | number | 선택 | | 페이지 크기 |
| loginHistoryId | number | 선택 | 기본:-1 | 이력 ID |
| userSeqId | number | 선택 | 기본:-1 | 사용자 SEQ ID |
| startDate | Date | 선택 | | 조회 시작일 |
| endDate | Date | 선택 | | 조회 종료일 |
| keyword | string | 선택 | length:1-100 | 검색 키워드 |

**Output** `PaginationResponseDto<LoginHistoryResponseDto>`
| 필드 | 타입 | 설명 |
|------|------|------|
| loginHistoryId | number | 이력 ID |
| tryIp | string | 로그인 IP |
| userSeqId | number | 사용자 SEQ ID |
| userId | string | 사용자 ID |
| userName | string | 사용자 이름 |
| createDate | Date | 로그인 일시 |

---

### `POST /users/history/get-users-login-history` — 사용자별 로그인 이력 (인증: O)

**Input (Body)** ← `FilteringLoginHistoryDto` (위와 동일)

**Output** `PaginationResponseDto<LoginHistoryResponseDto>`

---

## 4. 알람

### `POST /alarm/get-alarm-code-list` — 알람 목록 조회 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| page | number | 선택 | 기본:1, min:1 | 페이지 번호 |
| limit | number | 선택 | 기본:10, max:100 | 페이지 크기 |
| alarmTypeList | ALARM_HISTORY_TYPE[] | 선택 | | 알람 유형 필터 |
| importanceList | string | 선택 | 예: "1,2,3" | 중요도 필터 |
| manualValid | string | 선택 | | 매뉴얼 등록여부 |
| sendEnabled | string | 선택 | | 전송여부 필터 |
| keyword | string | 선택 | length:0-255 | 검색 키워드 |
| keywordTypeList | string | 선택 | | 키워드 유형 |
| id | number | 선택 | 기본:-1 | 알람 ID |
| validRecord | boolean | 선택 | 기본:true | 삭제여부 |
| code | string | 선택 | | 알람 코드 |
| equipmentTypeId | number | 선택 | 기본:-1 | 설비 타입 ID |

**Output** `PaginationResponseDto<AlarmResponseDto>`
| 필드 | 타입 | 설명 |
|------|------|------|
| alarmId | number | 알람 ID |
| code | string | 알람 코드 |
| type | ALARM_HISTORY_TYPE | 알람 유형 |
| importance | number | 중요도 (1~3) |
| description | string | 설명 |
| processMethod | string | 조치 방법 |
| sendEnabled | boolean | SNS 전송 여부 |
| resetAvailable | boolean | 리셋 조치 가능 여부 |
| equipmentTypeName | string | 설비 타입명 |
| userList | CommonUserInfoDto[] | 담당자 목록 |
| fileList | FileResponseDto[] | 매뉴얼 파일 목록 |
| createDate | Date | 생성일 |
| updateDate | Date | 수정일 |

---

### `GET /alarm/:alarmId` — 특정 알람 조회 (인증: O)

**Input (Path)** `alarmId: number`

**Output** `AlarmResponseDto`

---

### `GET /alarm/:alarmId/users` — 알람 담당자 조회 (인증: O)

**Input (Path)** `alarmId: number`

**Output** `CommonUserInfoDto[]`
| 필드 | 타입 | 설명 |
|------|------|------|
| seqId | number | 사용자 SEQ ID |
| id | string | 사용자 ID |
| name | string | 이름 |
| phoneNumber | string | 전화번호 |
| email | string | 이메일 |

---

### `GET /alarm/:alarmId/manual/:fileId` — 매뉴얼 파일 다운로드 (인증: O)

**Input (Path)** `alarmId: number`, `fileId: number`

**Output** `File (Binary)`

---

### `POST /alarm` — 알람 생성 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| code | string | 필수 | length:1-50 | 알람 코드 |
| type | ALARM_HISTORY_TYPE | 필수 | isEnum | 알람 유형 |
| description | string | 선택 | length:0-500 | 설명 |
| importance | number | 필수 | isIn:[1,2,3] | 중요도 |
| process_method | string | 선택 | length:0-50 | 조치 방법 |
| file_id_list | number[] | 선택 | | 매뉴얼 파일 ID 목록 |
| send_enabled | boolean | 선택 | 기본:false | SNS 전송 여부 |
| reset_available | boolean | 선택 | 기본:false | 리셋 조치 가능 여부 |
| equipment_type_id | number | 선택 | 기본:-1 | 설비 유형 ID |
| user_seq_id_list | number[] | 선택 | | 담당자 SEQ ID 목록 |

**Output** `AlarmResponseDto`

---

### `POST /alarm/check-code` — 알람 코드 중복 확인 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| alarmCode | string | 필수 | 알람 코드 |
| equipmentTypeId | number | 필수 | 설비 타입 ID |

**Output** `ResponseStatusDto`

---

### `POST /alarm/upload-alarm-csv` — 알람 CSV 업로드 (인증: O)

**Input** `multipart/form-data` — CSV 파일

**Output** `ResponseStatusDto`

---

### `POST /alarm/download-alarm-csv` — 알람 CSV 다운로드 (인증: O)

**Output** `CSV File (Binary)`

---

### `PUT /alarm/:alarmId` — 알람 수정 (인증: O)

**Input (Path)** `alarmId: number`

**Input (Body)** ← `UpdateAlarmDto` (CreateAlarmDto와 동일, 모두 선택)

**Output** `ResponseStatusDto`

---

### `PATCH /alarm/manual` — 매뉴얼 파일 업로드 (인증: O)

**Input** `multipart/form-data` — 파일 최대 5개 (PDF, PNG, JPG, JPEG)

**Output** `FileResponseDto[]`
| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 파일 ID |
| name | string | 원본 파일명 |
| storedName | string | 저장된 파일명 |
| path | string | 저장 경로 |

---

### `PATCH /alarm/:alarmId/users` — 담당자 추가 (인증: O)

**Input (Path)** `alarmId: number`

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| seqId | number | 필수 | 사용자 SEQ ID |

**Output** `ResponseStatusDto`

---

### `DELETE /alarm/soft` — 알람 삭제 (다중) (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| alarmIdList | string | 필수 | 쉼표 구분 알람 ID 목록 (예: "1,2,3") |

**Output** `ResponseStatusDto`

---

### `DELETE /alarm/:alarmId/users` — 담당자 삭제 (인증: O)

**Input (Path)** `alarmId: number`

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| seqId | number | 필수 | 사용자 SEQ ID |

**Output** `ResponseStatusDto`

---

### `DELETE /alarm/:alarmId/manual/:fileId` — 매뉴얼 파일 삭제 (인증: O)

**Input (Path)** `alarmId: number`, `fileId: number`

**Output** `ResponseStatusDto`

---

## 5. 알람 이력

### `POST /alarm-history/get-alarm-history` — 알람 이력 조회 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| page | number | 선택 | 페이지 번호 |
| limit | number | 선택 | 페이지 크기 |
| alarmHistoryId | number | 선택 | 알람 이력 ID |
| alarmTypeList | ALARM_HISTORY_TYPE[] | 선택 | 알람 유형 필터 |
| alarmStartDate | Date | 선택 | 알람 발생 시작일 |
| alarmEndDate | Date | 선택 | 알람 발생 종료일 |
| processType | ALARM_HISTORY_PROCESS_FLAG | 선택 | 조치 여부 (A/Y/N) |
| processStartDate | Date | 선택 | 조치 시작일 |
| processEndDate | Date | 선택 | 조치 종료일 |
| filteringEquipmentAlarmHistory | FilteringEquipmentAlarmHistoryDto | 선택 | 설비 알람 필터 |
| filteringInventoryAlarmHistory | FilteringInventoryAlarmHistoryDto | 선택 | 재고 알람 필터 |
| filteringPalletAlarmHistory | FilteringPalletAlarmHistoryDto | 선택 | 팔레트 알람 필터 |

**Output** `AggregatedAlarmHistoryResponseDto`

---

### `POST /alarm-history/get-paginated-alarm-history` — 알람 이력 페이징 조회 (인증: X)

**Input (Body)** ← 위와 동일

**Output** `PaginationResponseDto<AggregatedAlarmHistoryResponseDto>`

---

### `POST /alarm-history/update/:alarmHistoryId` — 알람 이력 처리 상태 갱신 (인증: O)

**Input (Path)** `alarmHistoryId: number`

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| message | string | 선택 | length:1-100 | 알람 메시지 |
| process_date | Date | 선택 | | 조치일 |
| process_message | string | 선택 | length:0-300 | 조치 내역 |
| type | ALARM_HISTORY_TYPE | 선택 | | 알람 유형 |

**Output** `ResponseStatusDto`

---

### `POST /alarm-history/get-process-status-by-equipment` — 설비별 처리 통계 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| startDate | Date | 선택 | 조회 시작일 |
| endDate | Date | 선택 | 조회 종료일 |

**Output** `AlarmProcessEquipmentStatisticsDto`

---

### `POST /alarm-history/get-process-status-by-date` — 날짜별 처리 통계 (인증: O)

**Input (Body)** ← `GettingAlarmHistoryStatisticsDto`

**Output** `AlarmProcessDailyStatisticsDto`

---

### `POST /alarm-history/get-top-alarm-list-by-equipment` — 설비별 상위 알람 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| startDate | Date | 선택 | 조회 시작일 |
| endDate | Date | 선택 | 조회 종료일 |

**Output** `TopAlarmResponseByEquipmentDto`

---

## 6. 메시지 전송

### `POST /alarm-message-dispatch/send-sms` — 알람 SMS 전송 (인증: O)

**Input (Body)** `CreateAlarmSmsDto`

**Output** `ResponseStatusDto`

---

### `POST /message-dispatch-history/get-by-history-id` — 메시지 전송 이력 (인증: O)

**Input (Body)** `FilteringMessageDispatchHistoryDto`

**Output** `PaginationResponseDto<MessageDispatchHistoryResponseDto>`

---

## 7. 장비

### `POST /equipment/get-equipment-list-with-type` — 유형별 장비 목록 (인증: O)

**Output** `EquipmentTypeResponseDto[]`
| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 장비 유형 ID |
| name | string | 유형명 |
| description | string | 유형 설명 |
| type | EQUIPMENT_TYPE | 유형 |
| createDate | Date | 생성일 |

---

### `POST /equipment-type/get-all-equipment-type` — 장비 유형 전체 조회 (인증: O)

**Output** `EquipmentTypeResponseDto[]`

---

### `POST /equipment-operation-history/get-pagination` — 설비 가동 내역 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| page | number | 선택 | 기본:1, min:1 | 페이지 번호 |
| limit | number | 선택 | 기본:10, max:100 | 페이지 크기 |

**Output** `PaginationResponseDto<EquipmentOperationResponseDto>`
| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 이력 ID |
| createDate | Date | 생성일 |
| operationStatus | OPERATION_STATUS | 가동 상태 |
| operationMaintenanceType | OPERATION_MAINTENANCE_TYPE | 보수 유형 |
| description | string | 상세 내용 |
| equipmentId | number | 설비 ID |
| equipmentName | string | 설비명 |
| equipmentTypeName | string | 설비 유형명 |

---

### `POST /equipment-operation-history/get-aggregation` — 설비 가동 집계 (인증: O)

**Input (Body)** `GettingEquipmentOperationStatusDto`

**Output** `EquipmentOperationHistoryAggregationDto[]`

---

### `PUT /equipment-operation-history/update/:id` — 설비 가동 내역 수정 (인증: O)

**Input (Path)** `id: number`

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| equipment_id | number | 선택 | 설비 ID |
| operation_status | OPERATION_STATUS | 선택 | 가동 상태 |
| operation_maintenance_type | OPERATION_MAINTENANCE_TYPE | 선택 | 보수 유형 |
| description | string | 선택 | 상세 내용 |
| create_date | Date | 선택 | 시작 시간 |

**Output** `ResponseStatusDto`

---

## 8. 창고

### `GET /warehouse/get-all-warehouse` — 창고 목록 (인증: O)

**Output** `WarehouseResponseDto[]`
| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 창고 ID |
| code | string | 창고 코드 |
| name | string | 창고 이름 |
| type | WAREHOUSE_TYPE | 창고 타입 |
| validRecord | boolean | 사용 여부 |
| createDate | Date | 생성일 |
| updateDate | Date | 수정일 |

---

### `GET /warehouse/get-warehouse/:id` — 창고 상세 (인증: O)

**Input (Path)** `id: number`

**Output** `WarehouseResponseDto`

---

### `DELETE /warehouse/soft-delete-warehouse/:id` — 창고 삭제 (인증: O)

**Input (Path)** `id: number`

**Output** `ResponseStatusDto`

---

## 9. 출고 규격

### `POST /shipping-specification/get-shipping-specification-list` — 목록 조회 (인증: O)

**Output** `ShippingSpecificationResponseDto[]`
| 필드 | 타입 | 설명 |
|------|------|------|
| shippingSpecificationId | number | ID |
| standardType | string | 타이어 규격 종류 |
| validRecord | boolean | 사용 여부 |
| usersId | string | 작성자 ID |
| usersSeqId | number | 작성자 SEQ ID |
| userName | string | 작성자 이름 |
| createDate | Date | 생성일 |
| updateDate | Date | 수정일 |

---

### `POST /shipping-specification/create-shipping-specification` — 생성 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| standard_type | string | 필수 | length:0-100 | 중점 출고 규격 |
| users_seq_id | number | 선택 | | 사용자 SEQ ID |

**Output** `ShippingSpecificationResponseDto`

---

### `POST /shipping-specification/get-daily-shipping-specification` — 일별 조회 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| startDate | Date | 선택 | 조회 시작일 |
| endDate | Date | 선택 | 조회 종료일 |

**Output** `DailyShippingSpecificationDto`

---

### `POST /shipping-specification/get-shipping-specification/:id` — 특정 조회 (인증: O)

**Input (Path)** `shippingSpecificationId: number`

**Output** `ShippingSpecificationResponseDto`

---

### `POST /shipping-specification/get-current-month-shipment` — 이번달 출하량 (인증: O)

**Output** `MonthShipmentDto[]`

---

### `PUT /shipping-specification/update-shipping-specification/:id` — 수정 (인증: O)

**Input (Path)** `shippingSpecificationId: number`

**Input (Body)** ← `UpdateShippingSpecificationDto` (CreateShippingSpecificationDto와 동일, 모두 선택)

**Output** `ResponseStatusDto`

---

### `DELETE /shipping-specification/soft-delete-shipping-specification/:id` — 삭제 (인증: O)

**Input (Path)** `shippingSpecificationId: number`

**Output** `ResponseStatusDto`

---

## 10. 작업 이력

### `POST /job-history/create-job-history` — 작업 이력 생성 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| pallet_id | number | 선택 | 팔레트 ID |
| warehouse_id | number | 선택 | 창고 ID |
| sku_key | string | 선택 | 품목 키 |
| standard_type | string | 선택 | 품목명 |
| working_status | WORKING_STATUS | 선택 | 작업 상태 |
| st_count | number | 선택 | 품목 수량 |
| loc_raw | string | 선택 | 위치 정보 |
| task_type | TASK_TYPE | 선택 | IN/OUT/MOVE/NONE |
| batch_number | string | 선택 | 배치 번호 |
| order_number | string | 선택 | 오더 번호 |
| order_flow | string | 선택 | 오더 순서 |
| job_date | Date | 선택 | 작업 일자 |

**Output** `JobHistoryResponseDto`
| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 작업 이력 ID |
| palletId | number | 팔레트 ID |
| warehouseId | number | 창고 ID |
| skuKey | string | 품목 키 |
| workingStatus | string | 작업 상태 |
| stCount | number | 품목 수량 |
| locRaw | string | 위치 정보 |
| taskType | string | 작업 유형 |
| createDate | Date | 생성일 |

---

### `PUT /job-history/update-job-history/:id` — 작업 이력 수정 (인증: O)

**Input (Path)** `jobHistoryId: number`

**Input (Body)** ← `UpdateJobHistoryDto` (CreateJobHistoryDto와 동일, 모두 선택)

**Output** `ResponseStatusDto`

---

### `POST /crane-item-history/get-daily-crane-out-counts` — 일별 크레인 출고 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| startDate | Date | 선택 | 조회 시작일 |
| endDate | Date | 선택 | 조회 종료일 |

**Output** `DailyStatusCountsDto`

---

### `POST /crane-item-history/get-daily-crane-stacked-counts` — 일별 크레인 적치 (인증: X)

**Input (Body)** ← `FilteringDateDto`

**Output** `DailyStatusCountsDto`

---

### `POST /crane-item-history/get-monthly-crane-counts` — 월별 크레인 출고 (인증: O)

**Input (Body)** ← `FilteringDateDto`

**Output** `MonthlyStatusCountsDto`

---

### `POST /crane-item-history/get-daily-top-standard-types-counts` — 상위 규격 타입 일별 조회 (인증: O)

**Input (Body)** ← `FilteringDateDto`

**Output** `StandardTypesDailyCountsDto`

---

### `POST /gantry-item-history/get-daily-gantry-out-counts` — 일별 갠트리 출고 (인증: X)

**Input (Body)** ← `FilteringDateDto`

**Output** `DailyStatusCountsDto`

---

## 11. 공지사항

### `POST /noti/get-all-noti` — 공지사항 목록 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| page | number | 선택 | | 페이지 번호 |
| limit | number | 선택 | | 페이지 크기 |
| startDate | Date | 선택 | | 조회 시작일 |
| endDate | Date | 선택 | | 조회 종료일 |
| keyword | string | 선택 | length:1-100 | 검색 키워드 |
| notiId | number | 선택 | | 공지사항 ID |

**Output** `PaginationResponseDto<NotiResponseDto>`
| 필드 | 타입 | 설명 |
|------|------|------|
| notiId | number | 공지사항 ID |
| title | string | 제목 |
| content | string | 내용 |
| usersId | string | 작성자 ID |
| usersSeqId | number | 작성자 SEQ ID |
| userName | string | 작성자 이름 |
| createDate | Date | 작성일 |
| updateDate | Date | 수정일 |

---

### `POST /noti/get-recently-noti-list` — 최근 공지사항 (인증: O)

**Output**
```json
{
  "week":   "NotiResponseDto[]",
  "thirty": "NotiResponseDto[]"
}
```

---

### `POST /noti/get-noti-by-id` — 특정 공지사항 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| notiId | number | 선택 | 공지사항 ID |

**Output** `NotiResponseDto`

---

### `POST /noti/create-noti` — 공지사항 생성 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| title | string | 필수 | length:1-100 | 제목 |
| content | string | 필수 | | 내용 |
| users_seq_id | number | 선택 | | 작성자 SEQ ID |

**Output** `NotiResponseDto`

---

### `PUT /noti/update-noti/:notiId` — 공지사항 수정 (인증: O)

**Input (Path)** `notiId: number`

**Input (Body)** ← `UpdateNotiDto` (CreateNotiDto와 동일, 모두 선택)

**Output** `ResponseStatusDto`

---

### `DELETE /noti/soft-delete-noti/:notiId` — 공지사항 삭제 (인증: O)

**Input (Path)** `notiId: number`

**Output** `ResponseStatusDto`

---

## 12. TODO

### `POST /todo/get-all` — 할 일 목록 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| page | number | 선택 | | 페이지 번호 |
| limit | number | 선택 | | 페이지 크기 |
| todoId | number | 선택 | 기본:-1 | TODO ID |
| alarmProcessFlag | boolean | 선택 | 기본:false | 알람 처리 여부 |
| targetStartDate | Date | 선택 | | 목표일 시작 |
| targetEndDate | Date | 선택 | | 목표일 종료 |

**Output** `PaginationResponseDto<TodoResponseDto>`
| 필드 | 타입 | 설명 |
|------|------|------|
| todoId | number | TODO ID |
| standardType | string | 타이어 규격 |
| targetCount | number | 목표량 |
| description | string | 내용 |
| targetStartDate | Date | 목표 시작일 |
| targetEndDate | Date | 목표 종료일 |
| targetDate | Date | 목표일 |
| alarmOffsetHours | number | 알람 발생 시간 |
| alarmProcessFlag | boolean | 알람 전송 여부 |
| usersId | string | 작성자 ID |
| usersSeqId | number | 작성자 SEQ ID |
| userName | string | 작성자 이름 |
| createDate | Date | 작성일 |
| updateDate | Date | 수정일 |

---

### `POST /todo/get/:todoId` — 특정 할 일 (인증: O)

**Input (Path)** `todoId: number`

**Output** `TodoResponseDto`

---

### `POST /todo/get-all-with-attainment` — 달성률 포함 목록 (인증: O)

**Input (Body)** ← `FilteringTodoDto` (위와 동일)

**Output** `PaginationResponseDto<AttainmentTodoDto>`

---

### `POST /todo/create` — 할 일 생성 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| target_start_date | Date | 필수 | | 목표 시작일 |
| target_end_date | Date | 필수 | | 목표 종료일 |
| target_count | number | 필수 | 기본:-1 | 목표량 |
| standard_type | string | 필수 | length:1-100 | 타이어 규격 |
| description | string | 선택 | | 내용 |
| alarm_offset_hours | number | 선택 | 기본:1 | 알람 발생 시간 |
| alarm_process_flag | boolean | 선택 | 기본:false | 알람 전송 여부 |
| users_seq_id | number | 선택 | | 작성자 SEQ ID |

**Output** `TodoResponseDto`

---

### `PUT /todo/update/:todoId` — 할 일 수정 (인증: O)

**Input (Path)** `todoId: number`

**Input (Body)** ← `UpdateTodoDto` (CreateTodoDto와 동일, 모두 선택)

**Output** `ResponseStatusDto`

---

### `DELETE /todo/delete/:todoId/soft` — 할 일 삭제 (인증: O)

**Input (Path)** `todoId: number`

**Output** `ResponseStatusDto`

---

## 13. 설정

### `GET /setting/system` — 시스템 설정 조회 (인증: O)

**Output** `SystemResponseDto`
| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| id | number | | 시스템 ID |
| alarmSendEnabled | boolean | true | 알람 전송 여부 |
| equipmentAlarmEnabled | boolean | true | 설비 알람 전송 여부 |
| inventoryAlarmEnabled | boolean | true | 재고 알람 전송 여부 |
| inventoryAlarmRemainingDay | number | 50 | 장기 재고 남은 일수 |
| loadWarningRatioCrane | number | 80 | 크레인 경고 비율 (%) |
| loadDangerRatioCrane | number | 90 | 크레인 위험 비율 (%) |
| loadWarningColorCrane | string | | 크레인 경고 색상 |
| loadDangerColorCrane | string | | 크레인 위험 색상 |
| loadWarningRatioGantry | number | 80 | 갠트리 경고 비율 (%) |
| loadDangerRatioGantry | number | 90 | 갠트리 위험 비율 (%) |
| loadWarningColorGantry | string | | 갠트리 경고 색상 |
| loadDangerColorGantry | string | | 갠트리 위험 색상 |
| createDate | Date | | 생성일 |
| updateDate | Date | | 수정일 |

---

### `PUT /setting/system` — 시스템 설정 수정 (인증: O)

**Input (Body)** ← `UpdateSystemDto` (SystemResponseDto의 모든 필드, 모두 선택)

**Output** `ResponseStatusDto`

---

### `GET /setting/system/refresh-browser` — 브라우저 새로고침 여부 (인증: X)

**Output** `boolean`

---

### `POST /setting/remote/get-all-remote` — 원격 설정 목록 (인증: O)

**Output** `RemoteResponseDto[]`
| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 원격 ID |
| location | string | 위치 |
| ip | string | IP 주소 |
| port | number | 포트 |
| seqId | number | 사용자 SEQ ID |
| validRecord | boolean | 사용 여부 |
| createDate | Date | 생성일 |
| updateDate | Date | 수정일 |

---

### `POST /setting/remote/get-remote-by-user-seq-id` — 사용자별 원격 설정 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| remoteId | number | 선택 | 원격 ID |
| userSeqId | number | 선택 | 사용자 SEQ ID |

**Output** `RemoteResponseDto[]`

---

### `POST /setting/remote/create-remote` — 원격 설정 생성 (인증: O)

**Input (Body)**
| 필드 | 타입 | 필수 | 조건 | 설명 |
|------|------|------|------|------|
| location | string | 필수 | length:1-50 | 위치 |
| ip | string | 필수 | length:1-20 | IP 주소 |
| port | number | 필수 | | 포트 번호 |
| seq_id | number | 필수 | | 사용자 SEQ ID |

**Output** `RemoteResponseDto`

---

### `PUT /setting/remote/update-remote/:remoteId` — 원격 설정 수정 (인증: O)

**Input (Path)** `remoteId: number`

**Input (Body)** ← `UpdateRemoteDto` (CreateRemoteDto와 동일, 모두 선택)

**Output** `ResponseStatusDto`

---

### `DELETE /setting/remote/delete-remote/:remoteId` — 원격 설정 삭제 (인증: O)

**Input (Path)** `remoteId: number`

**Output** `ResponseStatusDto`

---

## 14. 대시보드

### `POST /dash-board/get-dash-board` — 대시보드 조회 (인증: X)

**Input (Body)**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| startDate | Date | 선택 | 조회 시작일 |
| endDate | Date | 선택 | 조회 종료일 |

**Output** `DashBoardResponseDto`

---

## 유효성 검증 규칙 요약

| 항목 | 규칙 |
|------|------|
| **비밀번호** | 8-16자, 특수문자 1개 이상, 동일문자 연속 3개 미만 |
| **이메일** | isEmail 형식, max 50자 |
| **전화번호** | 10-12자리 숫자 |
| **페이지** | 기본:1, min:1 |
| **Limit** | 기본:10, min:1, max:100 |
| **Cursor** | 기본:0, min:0 |
| **알람 중요도** | 1(높음), 2(중간), 3(낮음) |
| **알람 코드** | max 50자 |
| **매뉴얼 파일** | 최대 5개, PDF/PNG/JPG/JPEG |
