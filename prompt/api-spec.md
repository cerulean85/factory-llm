# TITAN WAS API 스펙

## 문서 개요

- 기준 소스: `docs/titan-api.json`
- OpenAPI 버전: `3.0.0`
- 총 엔드포인트 수: `105`
- 표기: `★` 필수, `○` 선택

## 그룹 목록

- [ALARM](#alarm) (14)
- [ALARM-HISTORY](#alarm-history) (6)
- [ALARM-MESSAGE-DISPATCH](#alarm-message-dispatch) (1)
- [CELL-VIEW](#cell-view) (1)
- [CRANE-ITEM-HISTORY](#crane-item-history) (8)
- [DASH-BOARD](#dash-board) (1)
- [DOCK-VIEW](#dock-view) (1)
- [EQUIPMENT](#equipment) (1)
- [EQUIPMENT-OPERATION-HISTORY](#equipment-operation-history) (3)
- [EQUIPMENT-OPERATION-MAINTENANCE](#equipment-operation-maintenance) (4)
- [EQUIPMENT-TYPE](#equipment-type) (1)
- [GANTRY-ITEM-HISTORY](#gantry-item-history) (2)
- [HISTORY](#history) (1)
- [ITEM-MASTER-VIEW](#item-master-view) (1)
- [JOB-HISTORY](#job-history) (2)
- [MAIL](#mail) (1)
- [MESSAGE-DISPATCH-HISTORY](#message-dispatch-history) (1)
- [NOTI](#noti) (6)
- [REALTIME-VIEW](#realtime-view) (1)
- [REALTIME-WAREHOUSE-VIEW](#realtime-warehouse-view) (2)
- [ROOT](#root) (1)
- [SETTING](#setting) (7)
- [SHIPPING-SPECIFICATION](#shipping-specification) (7)
- [SSE](#sse) (1)
- [TODO](#todo) (6)
- [USERS](#users) (22)
- [WAREHOUSE](#warehouse) (3)

## ALARM

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/alarm/get-alarm-code-list` | 모든 알람 조회 |
| `GET` | `/alarm/{alarmId}` | 특정 알람 조회 |
| `PUT` | `/alarm/{alarmId}` | 알람 업데이트 |
| `GET` | `/alarm/{alarmId}/users` | 특정 알람 담당자 조회 |
| `PATCH` | `/alarm/{alarmId}/users` | 특정 알람 담당자 추가 |
| `DELETE` | `/alarm/{alarmId}/users` | 특정 알람 담당자 삭제 |
| `GET` | `/alarm/{alarmId}/manual/{fileId}` | 메뉴얼 파일 다운로드 |
| `DELETE` | `/alarm/{alarmId}/manual/{fileId}` | 매뉴얼 파일 삭제 |
| `POST` | `/alarm` | 알람 생성 |
| `POST` | `/alarm/upload-alarm-csv` | 알람 CSV 업로드 |
| `POST` | `/alarm/download-alarm-csv` | 알람 코드 CSV 파일 다운로드 |
| `POST` | `/alarm/check-code` | 알람 이름 중복 조회 |
| `PATCH` | `/alarm/manual` | 매뉴얼 파일 업로드 |
| `DELETE` | `/alarm/soft` | 알람 삭제 |

### 모든 알람 조회

`POST /alarm/get-alarm-code-list`

- 설명: 등록된 모든 알람 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringAlarmDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ○ | `alarmTypeList` | `string enum: EQUIPMENT, INVENTORY, PALLET` | 조회할 알람 유형 | `["EQUIPMENT","INVENTORY"]` |
| ○ | `importanceList` | `string` | 조회할 중요도 | `3,2,1` |
| ○ | `manualValid` | `string` | 매뉴얼 등록여부 | `-` |
| ○ | `sendEnabled` | `string` | 알람 전송여부 | `-` |
| ○ | `keyword` | `string` | 검색 키워드 | `-` |
| ○ | `keywordTypeList` | `string` | 조회할 키워드 유형 | `equipment,alarm_code,alarm_description,user_name` |
| ○ | `id` | `number` | 알람 ID | `-1` |
| ○ | `validRecord` | `boolean` | 알람 삭제 여부 | `true` |
| ○ | `code` | `string` | 알람 코드 | `-` |
| ○ | `equipmentTypeId` | `number` | 설비 타입 ID | `-1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 알람 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (AlarmResponseDto)>
★       alarmId: number // 알람 ID [default: -1]
★       code: string // 알람 코드
★       type: string enum: EQUIPMENT, INVENTORY, PALLET // 알람 유형 [default: EQUIPMENT]
★       importance: number // 중요도 [default: -1]
★       description: string // 알람 설명
★       createDate: string (date-time) // 발생일
★       updateDate: string (date-time) // 수정일
★       processMethod: string // 조치 방법
★       sendEnabled: boolean // 수정일 [default: false]
★       resetAvailable: boolean // reset 조치 가능 여부 [default: false]
★       userList: array<object (CommonUserInfoDto)> // 담당자 리스트 [default: ]
★         id: string // 사용자 ID [example: 1]
★         seqId: number // 사용자 SEQ ID [example: 1001]
★         name: string // 이름 [example: 홍길동]
★         phoneNumber: string // 전화번호 [example: 010-1234-5678]
★         email: string // 이메일 [example: hong@example.com]
★       equipmentTypeName: string // 설비타입명
★       fileList: array<object (FileResponseDto)> // 매뉴얼 파일 리스트 [default: ]
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

### 특정 알람 조회

`GET /alarm/{alarmId}`

- 설명: 특정 알람 조회

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmId` | `number` | 알람 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 특정 알람 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (AlarmResponseDto)
★     alarmId: number // 알람 ID [default: -1]
★     code: string // 알람 코드
★     type: string enum: EQUIPMENT, INVENTORY, PALLET // 알람 유형 [default: EQUIPMENT]
★     importance: number // 중요도 [default: -1]
★     description: string // 알람 설명
★     createDate: string (date-time) // 발생일
★     updateDate: string (date-time) // 수정일
★     processMethod: string // 조치 방법
★     sendEnabled: boolean // 수정일 [default: false]
★     resetAvailable: boolean // reset 조치 가능 여부 [default: false]
★     userList: array<object (CommonUserInfoDto)> // 담당자 리스트 [default: ]
★       id: string // 사용자 ID [example: 1]
★       seqId: number // 사용자 SEQ ID [example: 1001]
★       name: string // 이름 [example: 홍길동]
★       phoneNumber: string // 전화번호 [example: 010-1234-5678]
★       email: string // 이메일 [example: hong@example.com]
★     equipmentTypeName: string // 설비타입명
★     fileList: array<object (FileResponseDto)> // 매뉴얼 파일 리스트 [default: ]
```

### 알람 업데이트

`PUT /alarm/{alarmId}`

- 설명: 알람 업데이트

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmId` | `number` | 알람 ID | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateAlarmDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `code` | `string` | 알람 코드 | `-` |
| ○ | `type` | `string enum: EQUIPMENT, INVENTORY, PALLET` | 알람 타입 | `EQUIPMENT` |
| ○ | `description` | `string` | 알람 설명 | `-` |
| ○ | `importance` | `number` | 중요도 | `-1` |
| ○ | `processMethod` | `string` | 조치 방법 | `-` |
| ○ | `fileIdList` | `array<array<any>>` | 매뉴얼 파일 리스트 | `[]` |
| ○ | `sendEnabled` | `boolean` | SNS 전송 여부 | `false` |
| ○ | `resetAvailable` | `boolean` | 리셋 조치 가능 여부 | `false` |
| ○ | `equipmentTypeId` | `number` | 설비 유형 | `-1` |
| ○ | `userSeqIdList` | `array<array<any>>` | 담당자 목록 | `[]` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 알람 업데이트 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 특정 알람 담당자 조회

`GET /alarm/{alarmId}/users`

- 설명: 특정 알람 담당자 조회

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmId` | `number` | 알람 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 특정 알람 담당자 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (CommonUserInfoDto)
★     id: string // 사용자 ID [example: 1]
★     seqId: number // 사용자 SEQ ID [example: 1001]
★     name: string // 이름 [example: 홍길동]
★     phoneNumber: string // 전화번호 [example: 010-1234-5678]
★     email: string // 이메일 [example: hong@example.com]
```

### 특정 알람 담당자 추가

`PATCH /alarm/{alarmId}/users`

- 설명: 특정 알람 담당자 추가

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmId` | `number` | 알람 ID | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CommonUserInfoDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `id` | `string` | 사용자 ID | `1` |
| ★ | `seqId` | `number` | 사용자 SEQ ID | `1001` |
| ★ | `name` | `string` | 이름 | `홍길동` |
| ★ | `phoneNumber` | `string` | 전화번호 | `010-1234-5678` |
| ★ | `email` | `string` | 이메일 | `hong@example.com` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 특정 알람 담당자 추가 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 특정 알람 담당자 삭제

`DELETE /alarm/{alarmId}/users`

- 설명: 특정 알람 담당자 삭제

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmId` | `number` | 알람 ID | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CommonUserInfoDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `id` | `string` | 사용자 ID | `1` |
| ★ | `seqId` | `number` | 사용자 SEQ ID | `1001` |
| ★ | `name` | `string` | 이름 | `홍길동` |
| ★ | `phoneNumber` | `string` | 전화번호 | `010-1234-5678` |
| ★ | `email` | `string` | 이메일 | `hong@example.com` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 특정 알람 담당자 삭제 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 메뉴얼 파일 다운로드

`GET /alarm/{alarmId}/manual/{fileId}`

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmId` | `number` | 알람 ID | `-` |
| `path` | ★ | `fileId` | `number` | 파일 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/octet-stream` | 파일 다운로드 |

**Response Schema `200`**

```text
★ response: string (binary)
```

### 매뉴얼 파일 삭제

`DELETE /alarm/{alarmId}/manual/{fileId}`

- 설명: 매뉴얼 파일 삭제

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmId` | `number` | 알람 ID | `-` |
| `path` | ★ | `fileId` | `number` | 파일 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 매뉴얼 파일 삭제 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 알람 생성

`POST /alarm`

- 설명: 알람 생성

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateAlarmDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `code` | `string` | 알람 코드 | `-` |
| ★ | `type` | `string enum: EQUIPMENT, INVENTORY, PALLET` | 알람 타입 | `EQUIPMENT` |
| ○ | `description` | `string` | 알람 설명 | `-` |
| ★ | `importance` | `number` | 중요도 | `-1` |
| ★ | `processMethod` | `string` | 조치 방법 | `-` |
| ○ | `fileIdList` | `array<array<any>>` | 매뉴얼 파일 리스트 | `[]` |
| ○ | `sendEnabled` | `boolean` | SNS 전송 여부 | `false` |
| ○ | `resetAvailable` | `boolean` | 리셋 조치 가능 여부 | `false` |
| ○ | `equipmentTypeId` | `number` | 설비 유형 | `-1` |
| ○ | `userSeqIdList` | `array<array<any>>` | 담당자 목록 | `[]` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 생성된 알람 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (AlarmResponseDto)
★     alarmId: number // 알람 ID [default: -1]
★     code: string // 알람 코드
★     type: string enum: EQUIPMENT, INVENTORY, PALLET // 알람 유형 [default: EQUIPMENT]
★     importance: number // 중요도 [default: -1]
★     description: string // 알람 설명
★     createDate: string (date-time) // 발생일
★     updateDate: string (date-time) // 수정일
★     processMethod: string // 조치 방법
★     sendEnabled: boolean // 수정일 [default: false]
★     resetAvailable: boolean // reset 조치 가능 여부 [default: false]
★     userList: array<object (CommonUserInfoDto)> // 담당자 리스트 [default: ]
★       id: string // 사용자 ID [example: 1]
★       seqId: number // 사용자 SEQ ID [example: 1001]
★       name: string // 이름 [example: 홍길동]
★       phoneNumber: string // 전화번호 [example: 010-1234-5678]
★       email: string // 이메일 [example: hong@example.com]
★     equipmentTypeName: string // 설비타입명
★     fileList: array<object (FileResponseDto)> // 매뉴얼 파일 리스트 [default: ]
```

### 알람 CSV 업로드

`POST /alarm/upload-alarm-csv`

- 설명: 알람 CSV 업로드

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 알람 CSV 업로드 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 알람 코드 CSV 파일 다운로드

`POST /alarm/download-alarm-csv`

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/octet-stream` | 파일 다운로드 |

**Response Schema `200`**

```text
★ response: string (binary)
```

### 알람 이름 중복 조회

`POST /alarm/check-code`

- 설명: 알람 이름 중복 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CheckAlarmDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `alarmCode` | `string` | 알람 코드 | `-` |
| ★ | `equipmentTypeId` | `string` | 설비 타입 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 알람 이름 중복 조회 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 매뉴얼 파일 업로드

`PATCH /alarm/manual`

- 설명: 매뉴얼 파일 업로드

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmId` | `number` | 알람 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 매뉴얼 파일 업로드 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (Array)
```

### 알람 삭제

`DELETE /alarm/soft`

- 설명: 알람 삭제

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `DeleteAlarmDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `alarmIdList` | `string` | 알람 코드 리스트 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 알람 삭제 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

## ALARM-HISTORY

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/alarm-history/get-alarm-history` | 알람 내역 조회 |
| `POST` | `/alarm-history/get-paginated-alarm-history` | 알람 내역 조회 |
| `POST` | `/alarm-history/update/{alarmHistoryId}` | 알람 내역 갱신 |
| `POST` | `/alarm-history/get-process-status-by-equipment` | 설비별 알람 처리 내역 |
| `POST` | `/alarm-history/get-process-status-by-date` | 날짜별 알람 처리 내역 |
| `POST` | `/alarm-history/get-top-alarm-list-by-equipment` | 설비별 상위 알람 리스트 |

### 알람 내역 조회

`POST /alarm-history/get-alarm-history`

- 설명: 등록된 알람 내역 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringAlarmHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ○ | `alarmHistoryId` | `number` | 알람 히스토리 ID | `-` |
| ○ | `alarmTypeList` | `array<string enum: EQUIPMENT, INVENTORY, PALLET>` | 알람 타입 리스트 | `["EQUIPMENT","INVENTORY"]` |
| ○ | `alarmStartDate` | `string (date-time)` | 알람발생-조회시작일 | `null` |
| ○ | `alarmEndDate` | `string (date-time)` | 알람발생-조회종료일 | `null` |
| ○ | `processType` | `string enum: A, Y, N` | 조치 여부 | `Y` |
| ○ | `processStartDate` | `string (date-time)` | 알람조치-조회시작일 | `null` |
| ○ | `processEndDate` | `string (date-time)` | 알람조치-조회종료일 | `null` |
| ○ | `filteringEquipmentAlarmHistory` | `object (FilteringEquipmentAlarmHistoryDto)` | 설비 알람 필터링 | `-` |
| ○ | `filteringInventoryAlarmHistory` | `object (FilteringInventoryAlarmHistoryDto)` | 재고 알람 필터링 | `-` |
| ○ | `filteringPalletAlarmHistory` | `object (FilteringPalletAlarmHistoryDto)` | Pallet 알람 필터링 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 알람 내역 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (AggregatedAlarmHistoryResponseDto)
★     alarmHistory: object (AlarmHistoryBaseResponseDto) // 알람 히스토리 정보
★       alarmHistoryId: number // 알람 내역 번호 [default: -1]
★       createDate: string (date-time) // 알람 내역 생성일자 [default: 2026-04-14T07:04:55.990Z]
★       updateDate: string (date-time) // 알람 내역 변경일자 [default: 2026-04-14T07:04:55.990Z]
★       processDate: string (date-time) // 알람 내역 처리일자 [default: 2026-04-14T07:04:55.990Z]
★       message: string // 메시지
★       processMessage: string // 처리 메시지
★       type: string enum: EQUIPMENT, INVENTORY, PALLET // 알람 타입 [default: EQUIPMENT]
★       processUserList: array<object (CommonUserInfoDto)> // 조치자 리스트 [default: ] [example: [{"id":"user1","seqId":1,"name":"홍길동","phoneNumber":"010-1234-5678","email":"hong@example.com"}]]
★         id: string // 사용자 ID [example: 1]
★         seqId: number // 사용자 SEQ ID [example: 1001]
★         name: string // 이름 [example: 홍길동]
★         phoneNumber: string // 전화번호 [example: 010-1234-5678]
★         email: string // 이메일 [example: hong@example.com]
★     equipmentAlarmHistory: object (EquipmentAlarmHistoryResponseDto) // 설비 알람 히스토리 정보
★       equipmentAlarmHistoryId: number // 설비 알람 내역 번호 [default: -1]
★       alarmId: number // 알람코드 번호 [default: -1]
★       alarmCode: string // 알람코드
★       alarmProcessMethod: string // 조치방법
★       alarmImportance: number // 알람중요도
★       alarmDescription: string // 알람설명
★       equipmentName: string // 설비명
★       equipmentCode: string // 설비코드
★       equipmentTypeName: string // 설비유형명
★       equipmentTypeId: string // 설비유형ID
★       managerUserList: array<object (CommonUserInfoDto)> // 담당자 리스트 [default: ] [example: [{"id":"user1","seqId":1,"name":"홍길동","phoneNumber":"010-1234-5678","email":"hong@example.com"}]]
★         id: string // 사용자 ID [example: 1]
★         seqId: number // 사용자 SEQ ID [example: 1001]
★         name: string // 이름 [example: 홍길동]
★         phoneNumber: string // 전화번호 [example: 010-1234-5678]
★         email: string // 이메일 [example: hong@example.com]
★       fileList: array<object (FileResponseDto)> // 매뉴얼 파일 리스트 [default: ]
★     inventoryAlarmHistory: object (InventoryAlarmHistoryResponseDto) // 재고 알람 히스토리 정보
★       inventoryAlarmHistoryId: number // 재고 알람 내역 번호 [default: -1]
★       standardType: string // 알람유형
★       storedItemCount: number // 재고개수 [default: 0]
★       inventoryAlarmType: string enum: STORED, LONG_TERM, ETC // 재고 알람 타입 [default: STORED] [example: STORED]
★       alertType: string enum: WARNING, DANGER // 경고 수준 [default: WARNING] [example: WARNING]
★       warehouseName: string // 창고 이름 [example: warehouseName]
★       warehouseCode: string // 창고 코드 [example: warehouseCode]
★       warehouseType: string enum: CRANE, GANTRY, ETC, GTR // 창고 유형 [default: ETC] [example: ETC]
```

### 알람 내역 조회

`POST /alarm-history/get-paginated-alarm-history`

- 설명: 등록된 알람 내역 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringAlarmHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ○ | `alarmHistoryId` | `number` | 알람 히스토리 ID | `-` |
| ○ | `alarmTypeList` | `array<string enum: EQUIPMENT, INVENTORY, PALLET>` | 알람 타입 리스트 | `["EQUIPMENT","INVENTORY"]` |
| ○ | `alarmStartDate` | `string (date-time)` | 알람발생-조회시작일 | `null` |
| ○ | `alarmEndDate` | `string (date-time)` | 알람발생-조회종료일 | `null` |
| ○ | `processType` | `string enum: A, Y, N` | 조치 여부 | `Y` |
| ○ | `processStartDate` | `string (date-time)` | 알람조치-조회시작일 | `null` |
| ○ | `processEndDate` | `string (date-time)` | 알람조치-조회종료일 | `null` |
| ○ | `filteringEquipmentAlarmHistory` | `object (FilteringEquipmentAlarmHistoryDto)` | 설비 알람 필터링 | `-` |
| ○ | `filteringInventoryAlarmHistory` | `object (FilteringInventoryAlarmHistoryDto)` | 재고 알람 필터링 | `-` |
| ○ | `filteringPalletAlarmHistory` | `object (FilteringPalletAlarmHistoryDto)` | Pallet 알람 필터링 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 알람 내역 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (AggregatedAlarmHistoryResponseDto)>
★       alarmHistory: object (AlarmHistoryBaseResponseDto) // 알람 히스토리 정보
★         alarmHistoryId: number // 알람 내역 번호 [default: -1]
★         createDate: string (date-time) // 알람 내역 생성일자 [default: 2026-04-14T07:04:55.990Z]
★         updateDate: string (date-time) // 알람 내역 변경일자 [default: 2026-04-14T07:04:55.990Z]
★         processDate: string (date-time) // 알람 내역 처리일자 [default: 2026-04-14T07:04:55.990Z]
★         message: string // 메시지
★         processMessage: string // 처리 메시지
★         type: string enum: EQUIPMENT, INVENTORY, PALLET // 알람 타입 [default: EQUIPMENT]
★         processUserList: array<object (CommonUserInfoDto)> // 조치자 리스트 [default: ] [example: [{"id":"user1","seqId":1,"name":"홍길동","phoneNumber":"010-1234-5678","email":"hong@example.com"}]]
★           id: string // 사용자 ID [example: 1]
★           seqId: number // 사용자 SEQ ID [example: 1001]
★           name: string // 이름 [example: 홍길동]
★           phoneNumber: string // 전화번호 [example: 010-1234-5678]
★           email: string // 이메일 [example: hong@example.com]
★       equipmentAlarmHistory: object (EquipmentAlarmHistoryResponseDto) // 설비 알람 히스토리 정보
★         equipmentAlarmHistoryId: number // 설비 알람 내역 번호 [default: -1]
★         alarmId: number // 알람코드 번호 [default: -1]
★         alarmCode: string // 알람코드
★         alarmProcessMethod: string // 조치방법
★         alarmImportance: number // 알람중요도
★         alarmDescription: string // 알람설명
★         equipmentName: string // 설비명
★         equipmentCode: string // 설비코드
★         equipmentTypeName: string // 설비유형명
★         equipmentTypeId: string // 설비유형ID
★         managerUserList: array<object (CommonUserInfoDto)> // 담당자 리스트 [default: ] [example: [{"id":"user1","seqId":1,"name":"홍길동","phoneNumber":"010-1234-5678","email":"hong@example.com"}]]
★           id: string // 사용자 ID [example: 1]
★           seqId: number // 사용자 SEQ ID [example: 1001]
★           name: string // 이름 [example: 홍길동]
★           phoneNumber: string // 전화번호 [example: 010-1234-5678]
★           email: string // 이메일 [example: hong@example.com]
★         fileList: array<object (FileResponseDto)> // 매뉴얼 파일 리스트 [default: ]
★       inventoryAlarmHistory: object (InventoryAlarmHistoryResponseDto) // 재고 알람 히스토리 정보
★         inventoryAlarmHistoryId: number // 재고 알람 내역 번호 [default: -1]
★         standardType: string // 알람유형
★         storedItemCount: number // 재고개수 [default: 0]
★         inventoryAlarmType: string enum: STORED, LONG_TERM, ETC // 재고 알람 타입 [default: STORED] [example: STORED]
★         alertType: string enum: WARNING, DANGER // 경고 수준 [default: WARNING] [example: WARNING]
★         warehouseName: string // 창고 이름 [example: warehouseName]
★         warehouseCode: string // 창고 코드 [example: warehouseCode]
★         warehouseType: string enum: CRANE, GANTRY, ETC, GTR // 창고 유형 [default: ETC] [example: ETC]
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

### 알람 내역 갱신

`POST /alarm-history/update/{alarmHistoryId}`

- 설명: 알람 내역 갱신

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `alarmHistoryId` | `number` | - | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateProcessAlarmHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `processDate` | `string (date-time)` | 조치일자 | `2026-04-14T07:04:55.989Z` |
| ★ | `process_message` | `string` | 조치내역 | `-` |
| ★ | `userSeqIdList` | `array<number>` | 담당자 번호 목록 | `[]` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 알람 내역 갱신 성공여부 반환 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 설비별 알람 처리 내역

`POST /alarm-history/get-process-status-by-equipment`

- 설명: 설비별 알람 처리 내역

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `GettingAlarmHistoryStatisticsDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `startDate` | `string (date-time)` | 알람발생-조회시작일 | `2024-01-01` |
| ○ | `endDate` | `string (date-time)` | 알람발생-조회종료일 | `2025-12-31` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비별 알람 처리 내역 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (AlarmProcessEquipmentStatisticsDto)
★     data: array<object (EquipmentAlarmProcessStatusDto)> // 설비별 알람 처리 현황 리스트
★       equipmentName: string // 설비 [example: GANTRY]
★       equipmentTotalCount: number // 해당 설비 알람 총 개수 [example: 10]
★       equipmentProcessCount: number // 해당 설비 처리된 알람 수 [example: 7]
★       equipmentProcessRate: number // 해당 설비 처리된 알람 처리율(%) [example: 25.123]
★     totalCount: number // 전체 알람 총 개수 [example: 50]
★     processCount: number // 전체 처리된 알람 수 [example: 42]
★     processRate: number // 전체 처리율(%) [example: 84.234]
```

### 날짜별 알람 처리 내역

`POST /alarm-history/get-process-status-by-date`

- 설명: 날짜별 알람 처리 내역

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `GettingAlarmHistoryStatisticsDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `startDate` | `string (date-time)` | 알람발생-조회시작일 | `2024-01-01` |
| ○ | `endDate` | `string (date-time)` | 알람발생-조회종료일 | `2025-12-31` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 날짜별 알람 처리 내역 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (AlarmProcessDailyStatisticsDto)
★     data: array<object (DailyAlarmProcessStatusDto)> // 날짜별 알람 처리 현황 리스트
★       date: string // 날짜 [example: 2024-05-18]
★       dayTotalCount: number // 해당 일자 알람 총 개수 [example: 10]
★       dayProcessCount: number // 해당 일자 처리된 알람 수 [example: 7]
★       dayProcessRate: number // 해당 처리된 알람 처리율(%) [example: 25.123]
★     totalCount: number // 전체 알람 총 개수 [example: 50]
★     processCount: number // 전체 처리된 알람 수 [example: 42]
★     processRate: number // 전체 처리율(%) [example: 84]
```

### 설비별 상위 알람 리스트

`POST /alarm-history/get-top-alarm-list-by-equipment`

- 설명: 설비별 상위 알람 리스트

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비별 상위 알람 리스트 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (TopAlarmResponseByEquipmentDto)
★     equipmentType: string // 설비 유형 [example: GANTRY]
★     units: array<object (EquipmentUnitDto)> // 설비 호기별 정보
★       equipmentUnit: string // 설비 호기 [example: GANTRY_#1]
★       alarms: array<object (AlarmItemDto)> // 상위 알람 목록
★         rank: number // 순위 [example: 1]
★         alarmCode: string // 알람 코드 [example: 1]
★         alarmDesc: string // 알람 설명 [example: DESCRIPTION]
★         count: number // 발생 횟수 [example: 50]
```

## ALARM-MESSAGE-DISPATCH

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/alarm-message-dispatch/send-sms` | 메시지 전송 |

### 메시지 전송

`POST /alarm-message-dispatch/send-sms`

- 설명: 성공 여부

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateAlarmSmsDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `message` | `string` | 전송 내용 | `-` |
| ★ | `phoneNumber` | `string` | 국제전화번호 | `-` |
| ★ | `alarmHistoryId` | `number` | 히스토리 ID | `1` |
| ★ | `usersSeqId` | `number` | 전송 Seq ID | `1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 메세지 전송 성공 여부 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

## CELL-VIEW

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/cell-view/get-all-cell` | 셀 별 현황 |

### 셀 별 현황

`POST /cell-view/get-all-cell`

- 설명: 셀 별 현황

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringCellViewDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `id` | `number` | Cell View ID | `-1` |
| ★ | `warehouseType` | `string enum: CRANE, GANTRY, ETC, GTR` | 창고 타입 | `-` |
| ★ | `warehouseCode` | `string` | 창고 코드 (식별자) | `-` |
| ★ | `palletId` | `number` | Pallet ID | `-1` |
| ★ | `locX` | `number` | 적재 위치 (bank) | `-1` |
| ★ | `locY` | `number` | 적재 위치 (bay) | `-1` |
| ★ | `locZ` | `number` | 적재 위치 (level) | `-1` |
| ★ | `luggageFlag` | `boolean` | 화물 유무 | `false` |
| ★ | `batchNumber` | `string` | 배치 번호 | `-` |
| ★ | `orderNumber` | `string` | 오더 번호 | `-` |
| ★ | `warehouseId` | `number` | 창고 ID | `-1` |
| ★ | `enable` | `boolean` | 사용 여부 | `true` |
| ★ | `InStartDate` | `string (date-time)` | 입고 조회 시작일 | `-` |
| ★ | `InEndDate` | `string (date-time)` | 입고 조회 종료일 | `-` |
| ★ | `cellStatus` | `string enum: 0, 1, 2, 5, 6` | 셀 상태 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 셀 별 현황 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (CellViewResponseDto)
★     id: number // Cell View ID [default: -1]
★     warehouseId: number // Warehouse ID [default: -1] [example: 1]
★     palletId: number // Pallet ID [default: -1] [example: 1]
★     locX: number // loc_x [default: -1] [example: 1]
★     locY: number // loc_y [default: -1] [example: 1]
★     locZ: number // loc_z [default: -1] [example: 1]
★     enable: boolean // enable [default: true] [example: true]
★     cellStatus: string enum: 0, 1, 2, 5, 6 // cell_status [example: 0]
★     skuKey: string // sku_key [example: 1234567890]
★     standardType: string // standard_type [example: 1234567890]
★     stCount: number // st_count [default: -1] [example: 1]
★     inDate: string (date-time) // in_date [default: 2026-04-14T07:04:56.129Z] [example: 2026-04-14T07:04:56.129Z]
★     updateDate: string (date-time) // update_date [default: 2026-04-14T07:04:56.129Z] [example: 2026-04-14T07:04:56.129Z]
★     luggageFlag: boolean // 화물 유무 [default: false] [example: false]
★     batchNumber: string // 배치 번호 [example: 1234567890]
★     orderNumber: string // 오더 번호 [example: 1234567890]
★     orderFlow: string // 오더 순서 [example: 1234567890]
★     locAll: number // 적재 위치 전체 [default: -1] [example: -1]
★     locUnit: string // 적재 위치 전체 [example: 1234]
```

## CRANE-ITEM-HISTORY

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/crane-item-history/get-pallet-current-stacked-counts` | 팔레트 적치 현황 개수 집계 |
| `POST` | `/crane-item-history/get-current-crane-counts` | Crane 현황 집계 |
| `POST` | `/crane-item-history/get-pallet-level-groups` | 팔레트 레벨 구간 별 적재 개수 |
| `POST` | `/crane-item-history/get-long-product-groups` | 장기 재고 기간 별 개수 |
| `POST` | `/crane-item-history/get-daily-crane-out-counts` | 일별 크레인 출고 현황 |
| `POST` | `/crane-item-history/get-daily-crane-stacked-counts` | 일별 크레인 적치 현황 |
| `POST` | `/crane-item-history/get-monthly-crane-counts` | 월별 크레인 출고 현황 |
| `POST` | `/crane-item-history/get-daily-top-standard-types-counts` | 상위 타입 및 일별 조회 |

### 팔레트 적치 현황 개수 집계

`POST /crane-item-history/get-pallet-current-stacked-counts`

- 설명: 팔레트 적치 현황 개수 집계

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 팔레트 적치 현황 개수 집계 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (CraneCellCurrentStackedCountsDto)
★     currentCount: number // 현재 재고 수량 [default: -1]
★     totalCount: number // 총 재고 수량 [default: -1]
★     rate: number // 재고 비율 [default: -1]
★     emptyCellCount: number // 공 쉘프 수 [default: -1]
```

### Crane 현황 집계

`POST /crane-item-history/get-current-crane-counts`

- 설명: Crane 현황 집계

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | Crane 현황 집계 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (CellStackedCountsDto)
★     warehouseId: number // 창고 ID [default: -1]
★     stackAreaCode: string // StackArea (STC:Equipment기준, GTR:Warehouse기준)
★     currentCount: number // 현재 개수 [default: -1] [example: 1]
★     standardTypes: array<string> // 규격 이름 및 개수 [default: ] [example: [["A",1],["B",4]]]
★     totalCount: number // 전체 개수 [default: -1] [example: 1]
★     disabledCount: number // 금지 셀 수 [default: -1] [example: 1]
★     checkCount: number // Check 셀 수 [default: -1] [example: 1]
★     emptyCellCount: number // 빈 쉘프 수 [default: -1] [example: 1]
★     standardTypeCount: number // 규격 개수 [default: -1] [example: 1]
```

### 팔레트 레벨 구간 별 적재 개수

`POST /crane-item-history/get-pallet-level-groups`

- 설명: 팔레트 레벨 구간 별 적재 개수

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 팔레트 레벨 구간 별 적재 개수 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PalletGroupsResponseDto)
★     name: string // 팔레트 구간 별 그룹
★     recordCount: number // 전체 데이터 개수 [default: -1]
★     productCount: number // 현재 남은 재고 개수 [default: -1]
★     average: number // 현재 남은 재고 비율
```

### 장기 재고 기간 별 개수

`POST /crane-item-history/get-long-product-groups`

- 설명: 장기 재고 기간 별 개수

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 장기 재고 기간 별 개수 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (LongProductResponseDto)
★     name: string // 장기재고명
★     totalCount: number // 총 재고 개수 [default: -1]
★     items: array<object (LongProductItemsResponseDto)> // 장기 재고 기간별 그룹 [default: ]
★       types: string // 타이어 규격
★       totalCount: number // 재고 개수 [default: -1]
★       name: string // 장기 재고 기간별 그룹
★       typeRate: number // 장기 재고 중 규격별 비중 [default: -1]
★     nameRate: number // 장기 재고 그룹별 비율 [default: -1]
```

### 일별 크레인 출고 현황

`POST /crane-item-history/get-daily-crane-out-counts`

- 설명: 일별 크레인 출고 현황

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 크레인 출고 현황 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (DailyStatusCountsDto)
★     date: string // 날짜 [example: 2025-05-07]
★     currentCount: number // 출고 개수 [example: 25]
★     cumulativeCount: number // 누적 출고 개수 [example: 50]
```

### 일별 크레인 적치 현황

`POST /crane-item-history/get-daily-crane-stacked-counts`

- 설명: 일별 크레인 적치 현황

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 크레인 적치 현황 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (DailyStatusCountsDto)
★     date: string // 날짜 [example: 2025-05-07]
★     currentCount: number // 출고 개수 [example: 25]
★     cumulativeCount: number // 누적 출고 개수 [example: 50]
```

### 월별 크레인 출고 현황

`POST /crane-item-history/get-monthly-crane-counts`

- 설명: 월별 크레인 출고 현황

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 크레인 출고 현황 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (MonthlyStatusCountsDto)
★     warehouseId: number // 창고 ID [example: 1]
★     palletInCount: number // Pallet 입고량 [example: 25]
★     palletOutCount: number // Pallet 출고량 [example: 25]
★     tireInCount: number // tire(item) 입고량 [example: 25]
★     tireOutCount: number // tire(item) 출고량 [example: 25]
```

### 상위 타입 및 일별 조회

`POST /crane-item-history/get-daily-top-standard-types-counts`

- 설명: 상위 타입 및 일별 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 상위 타입 및 일별 조회 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (StandardTypesDailyCountsDto)
★     date: string // 날짜 [example: 2025-05-07]
★     items: array<string> // 타이어 규격 및 출고 개수 [example: [object Object]]
```

## DASH-BOARD

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/dash-board/get-dash-board` | 대시보드 |

### 대시보드

`POST /dash-board/get-dash-board`

- 설명: 대시보드

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 대시보드 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (DashBoardResponseDto)
★     palletCurrentCounts: object (PalletCurrentCountsDto) // 팔레트 재고 현황
★       currentCount: number // 현재 재고 수량 [default: -1]
★       totalCount: number // 총 재고 수량 [default: -1]
★       rate: number // 재고 비율 [default: -1]
★       emptyCellCount: number // 공 쉘프 수 [default: -1]
★     alarmHistoryEquipmentStatus: object (AlarmHistoryEquipmentStatusDto) // 설비별 알람 처리 현황
★       data: array<object (EquipmentAlarmProcessStatusDto)> // 설비별 알람 처리 현황 리스트
★         equipmentName: string // 설비 [example: GANTRY]
★         equipmentTotalCount: number // 해당 설비 알람 총 개수 [example: 10]
★         equipmentProcessCount: number // 해당 설비 처리된 알람 수 [example: 7]
★         equipmentProcessRate: number // 해당 설비 처리된 알람 처리율(%) [example: 25.123]
★       totalCount: number // 전체 알람 총 개수 [example: 50]
★       processCount: number // 전체 처리된 알람 수 [example: 42]
★       processRate: number // 전체 처리율(%) [example: 84.234]
★     dailyCraneCounts: array<string> // 크래인 출고 현황 [example: [object Object]]
★     dailyGantryCounts: array<string> // 갠트리 출고 현황 [example: [object Object]]
★     craneStackedCounts: array<string> // 크래인 적치 현황 [example: [object Object]]
★     gantryStackedCounts: array<string> // 갠트리 적치 현황 [example: [object Object]]
```

## DOCK-VIEW

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/dock-view/get-all-dock` | 도크 별 출하 현황 |

### 도크 별 출하 현황

`POST /dock-view/get-all-dock`

- 설명: 도크 별 출하 현황

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDockViewDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `dockId` | `number` | Dock ID | `-1` |
| ★ | `gantryCode` | `number` | Gantry Code | `-1` |
| ★ | `status` | `string` | 출고 상태 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 도크 별 출하 현황 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (DockViewResponseDto)
★     id: number // Dock ID [default: -1]
★     gantryCode: number // Gantry Code [default: -1] [example: 1]
★     dockNo: number // Dock 번호 [default: -1] [example: 1]
★     status: string // status [example: 출고 상태]
★     shipmentOrder: number // ERP 오더 번호 [default: -1] [example: 1]
★     containerNo: number // 컨테이너 번호 [default: -1] [example: 1]
★     unitOrderCount: number // 한 오더 내 오더 개수 [default: -1] [example: 1]
★     orderCount: number // 오더 수량 [default: -1] [example: 1]
★     outingCount: number // 출고 중 수량 [default: -1] [example: 1]
★     inGantryCount: number // Gantry 내 수량 [default: -1] [example: 1]
★     conveyorCount: number // 컨베이어 내 수량 [default: -1] [example: 1]
★     completionCount: number // 완료 수량 [default: -1] [example: 1]
★     remandCount: number // 보류 수량 [default: -1] [example: 1]
★     badCount: number // 불량 수량 [default: -1] [example: 1]
```

## EQUIPMENT

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/equipment/get-equipment-list-with-type` | 모든 장비 유형 조회 |

### 모든 장비 유형 조회

`POST /equipment/get-equipment-list-with-type`

- 설명: 등록된 모든 장비 유형 조회

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 장비 내역 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (EquipmentTypeResponseDto)>
★       id: number // 장비 유형 번호 [default: -1]
★       createDate: string (date-time) // 장비 유형 생성일자 [default: 2026-04-14T07:04:55.938Z]
★       name: string // 장비 유형명
★       description: string // 장비 설명
★       type: string enum: CNV, RGV, STC, GTR, NONE // 장비 유형 [default: CNV]
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

## EQUIPMENT-OPERATION-HISTORY

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/equipment-operation-history/get-pagination` | 설비 가동 내역 전체 조회 |
| `POST` | `/equipment-operation-history/get-aggregation` | 설비 가동 내역 집계 |
| `PUT` | `/equipment-operation-history/update/{id}` | 설비 가동 내역 수정 |

### 설비 가동 내역 전체 조회

`POST /equipment-operation-history/get-pagination`

- 설명: 설비 가동 내역 전체 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `PaginationRequestDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 가동 내역 전체 조회 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (EquipmentOperationResponseDto)
★     id: number // 설비 가동 이력 ID [default: -1]
★     createDate: string (date-time) // 생성일자 [default: 2026-04-14T07:04:56.261Z]
★     operationStatus: string enum: START, STOP, FAULT, UNKNOWN // 가동 상태 [default: UNKNOWN]
★     operationMaintenanceType: string enum: DEFAULT, PM, SCHEDULED_STOP, INSPECTION, REPAIR, ETC // 가동 보수 유형 [default: DEFAULT]
★     description: string // 상세 내용
★     equipmentId: number // 설비 ID [default: -1]
★     equipmentName: string // 설비 이름
★     equipmentTypeName: string // 설비 유형
```

### 설비 가동 내역 집계

`POST /equipment-operation-history/get-aggregation`

- 설명: 설비 가동 내역 집계

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `GettingEquipmentOperationStatusDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-03-01` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-03-31` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 가동 내역 집계 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (EquipmentOperationHistoryAggregationDto)
★     equipmentId: number // 설비Id [default: -1]
★     equipmentName: string // 설비명 [default: GANTRY_#2]
★     equipmentCode: string // 설비코드(식별자) [default: gtr-123-sv]
★     equipmentTypeId: string // 설비타입ID [default: 1]
★     equipmentTypeName: string // 설비타입명 [default: GANTRY]
★     currentOperationStatus: string enum: START, STOP, FAULT, UNKNOWN // 현재설비상태 [default: START]
★     totalStopMin: number // 총 고장 시간(Min) [default: 0]
★     totalRunningMin: number // 총 가용 시간(Min) [default: 0]
★     totalFaultMin: number // 총 복구 시간 [default: 0]
★     operationRate: number // 가동률 [default: 0]
★     faultRate: number // 고장률 [default: 0]
★     operationDetailList: number // 가동현황상세내역 [default: ] [example: [{"startTime":"2025-01-01 08:30:00","endTime":"2025-01-01 12:45:00","operationStatus":"START","operationMaintenanceType":"DEFAULT","durationMin":255},{"startTime":"2025-01-01 13:30:00","endTime":"2025-01-01 18:00:00","operationStatus":"STOP","operationMaintenanceType":"REPAIR","durationMin":270}]]
```

### 설비 가동 내역 수정

`PUT /equipment-operation-history/update/{id}`

- 설명: 설비 가동 내역 수정

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `id` | `number` | - | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateEquipmentOperationHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `operationStatus` | `string enum: START, STOP, FAULT, UNKNOWN` | 가동 상태 | `START` |
| ○ | `operationMaintenanceType` | `string enum: DEFAULT, PM, SCHEDULED_STOP, INSPECTION, REPAIR, ETC` | 가동 보수 유형 | `DEFAULT` |
| ○ | `description` | `string` | description | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 가동 내역 수정 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

## EQUIPMENT-OPERATION-MAINTENANCE

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/equipment-operation-maintenance/create` | 설비 가동 보수 이력 생성 |
| `POST` | `/equipment-operation-maintenance/get-pagination` | 설비 가동 보수 이력 조회 |
| `POST` | `/equipment-operation-maintenance/get-aggregation` | 설비 가동 보수 이력 집계 |
| `PUT` | `/equipment-operation-maintenance/update/{id}` | 설비 가동 보수 이력 수정 |

### 설비 가동 보수 이력 생성

`POST /equipment-operation-maintenance/create`

- 설명: 설비 가동 보수 이력 생성

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateEquipmentOperationMaintenanceDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `equipmentId` | `number` | 설비 ID | `-1` |
| ★ | `startDate` | `string (date-time)` | 시작일시 | `null` |
| ★ | `endDate` | `string (date-time)` | 종료일시 | `null` |
| ★ | `operationMaintenanceType` | `string enum: DEFAULT, PM, SCHEDULED_STOP, INSPECTION, REPAIR, ETC` | 가동 보수 유형 | `DEFAULT` |
| ★ | `description` | `string` | description | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 가동 보수 이력 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (EquipmentOperationMaintenanceResponseDto)
★     id: number // 설비 가동 이력 ID [default: -1]
★     createDate: string (date-time) // 생성일자 [default: 2026-04-14T07:04:56.274Z]
★     operationMaintenanceType: string enum: DEFAULT, PM, SCHEDULED_STOP, INSPECTION, REPAIR, ETC // 가동 보수 유형 [default: DEFAULT]
★     startDate: string (date-time) // 보수 시작 일자 [default: 2026-04-14T07:04:56.274Z]
★     endDate: string (date-time) // 보수 종료 일자 [default: 2026-04-14T07:04:56.274Z]
★     description: string // 상세 내용
★     equipmentId: number // 설비 ID [default: -1]
★     equipmentName: string // 설비 이름
★     equipmentTypeName: string // 설비 유형 이름
★     equipmentTypeId: number // 설비 유형 ID [default: -1]
```

### 설비 가동 보수 이력 조회

`POST /equipment-operation-maintenance/get-pagination`

- 설명: 설비 가동 보수 이력 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringEquipmentOperationMaintenanceDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ○ | `equipmentOperationMaintenanceId` | `number` | 가동 보수 이력 ID | `-1` |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |
| ○ | `operationMaintenanceType` | `string enum: DEFAULT, PM, SCHEDULED_STOP, INSPECTION, REPAIR, ETC` | 가동 보수 유형 | `DEFAULT` |
| ○ | `description` | `string` | 상세설명 | `-` |
| ○ | `equipmentId` | `number` | 설비 ID | `-1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 가동 보수 이력 조회 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (EquipmentOperationResponseDto)
★     id: number // 설비 가동 이력 ID [default: -1]
★     createDate: string (date-time) // 생성일자 [default: 2026-04-14T07:04:56.261Z]
★     operationStatus: string enum: START, STOP, FAULT, UNKNOWN // 가동 상태 [default: UNKNOWN]
★     operationMaintenanceType: string enum: DEFAULT, PM, SCHEDULED_STOP, INSPECTION, REPAIR, ETC // 가동 보수 유형 [default: DEFAULT]
★     description: string // 상세 내용
★     equipmentId: number // 설비 ID [default: -1]
★     equipmentName: string // 설비 이름
★     equipmentTypeName: string // 설비 유형
```

### 설비 가동 보수 이력 집계

`POST /equipment-operation-maintenance/get-aggregation`

- 설명: 설비 보수 이력 집계

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 보수 이력 집계 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (EquipmentOperationMaintenanceAggregationDto)
★     equipmentId: number // 설비Id [default: -1]
★     equipmentName: string // 설비명 [default: GANTRY_#2]
★     equipmentTypeId: string // 설비타입ID [default: 1]
★     equipmentTypeName: string // 설비타입명 [default: GANTRY]
★     maintenanceDetailList: number // 가동현황상세내역 [default: ] [example: [{"startTime":"2025-01-01 08:30:00","endTime":"2025-01-01 12:45:00","operationStatus":"START","operationMaintenanceType":"DEFAULT","durationMin":255,"description":"고장이 났습니다."},{"startTime":"2025-01-01 13:30:00","endTime":"2025-01-01 18:00:00","operationStatus":"STOP","operationMaintenanceType":"REPAIR","durationMin":270,"description":"고장이 났습니다."}]]
```

### 설비 가동 보수 이력 수정

`PUT /equipment-operation-maintenance/update/{id}`

- 설명: 설비 가동 보수 이력 수정

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `id` | `number` | - | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateEquipmentOperationMaintenanceDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `operationMaintenanceType` | `string enum: DEFAULT, PM, SCHEDULED_STOP, INSPECTION, REPAIR, ETC` | 가동 보수 유형 | `DEFAULT` |
| ★ | `description` | `string` | description | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 가동 보수 이력 수정 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

## EQUIPMENT-TYPE

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/equipment-type/get-all-equipment-type` | 모든 장비 유형 조회 |

### 모든 장비 유형 조회

`POST /equipment-type/get-all-equipment-type`

- 설명: 등록된 모든 장비 유형 조회

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 장비 내역 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (EquipmentTypeResponseDto)
★     id: number // 장비 유형 번호 [default: -1]
★     createDate: string (date-time) // 장비 유형 생성일자 [default: 2026-04-14T07:04:55.938Z]
★     name: string // 장비 유형명
★     description: string // 장비 설명
★     type: string enum: CNV, RGV, STC, GTR, NONE // 장비 유형 [default: CNV]
```

## GANTRY-ITEM-HISTORY

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/gantry-item-history/get-current-gantry-counts` | Gantry 현황 집계 |
| `POST` | `/gantry-item-history/get-daily-gantry-out-counts` | 일별 갠트리 출고 현황 |

### Gantry 현황 집계

`POST /gantry-item-history/get-current-gantry-counts`

- 설명: Gantry 현황 집계

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | Gantry 현황 집계 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (CellStackedCountsDto)
★     warehouseId: number // 창고 ID [default: -1]
★     stackAreaCode: string // StackArea (STC:Equipment기준, GTR:Warehouse기준)
★     currentCount: number // 현재 개수 [default: -1] [example: 1]
★     standardTypes: array<string> // 규격 이름 및 개수 [default: ] [example: [["A",1],["B",4]]]
★     totalCount: number // 전체 개수 [default: -1] [example: 1]
★     disabledCount: number // 금지 셀 수 [default: -1] [example: 1]
★     checkCount: number // Check 셀 수 [default: -1] [example: 1]
★     emptyCellCount: number // 빈 쉘프 수 [default: -1] [example: 1]
★     standardTypeCount: number // 규격 개수 [default: -1] [example: 1]
```

### 일별 갠트리 출고 현황

`POST /gantry-item-history/get-daily-gantry-out-counts`

- 설명: 일별 갠트리 출고 현황

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 갠트리 출고 현황 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (DailyStatusCountsDto)
★     date: string // 날짜 [example: 2025-05-07]
★     currentCount: number // 출고 개수 [example: 25]
★     cumulativeCount: number // 누적 출고 개수 [example: 50]
```

## HISTORY

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/history/get-all-login-history` | 모든 로그인 이력 조회 |

### 모든 로그인 이력 조회

`POST /history/get-all-login-history`

- 설명: 모든 로그인 이력 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringLoginHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ★ | `loginHistoryId` | `number` | LoginHistory ID | `-1` |
| ★ | `userSeqId` | `number` | User ID | `-1` |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `-` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `-` |
| ★ | `keyword` | `string` | 조회 키워드 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 로그인 이력 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (LoginHistoryResponseDto)>
★       loginHistoryId: number // 로그인 이력 ID [default: -1]
★       tryIp: string // 로그인 IP
★       userSeqId: number // 사용자 Seq ID [default: -1]
★       userId: string // 사용자 ID
★       userName: string // 사용자 이름
★       createDate: string (date-time) // 로그인 날짜
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

## ITEM-MASTER-VIEW

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/item-master-view/get-all-item-master-view` | 아이템 마스터 뷰 |

### 아이템 마스터 뷰

`POST /item-master-view/get-all-item-master-view`

- 설명: 아이템 마스터 뷰

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringItemMasterViewDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `skuKey` | `string` | sku_key | `-` |
| ★ | `standardType` | `string` | standard_type | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 아이템 마스터 뷰 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ItemMasterViewResponseDto)
★     skuKey: string // sku_key [example: 111]
★     standardType: string // standard_type [example: type]
```

## JOB-HISTORY

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/job-history/create-job-history` | job 내역 생성 |
| `PUT` | `/job-history/update-job-history/{jobHistoryId}` | PUT /job-history/update-job-history/{jobHistoryId} |

### job 내역 생성

`POST /job-history/create-job-history`

- 설명: job 내역 생성

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateJobHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `palletId` | `number` | pallet ID | `-1` |
| ★ | `warehouseId` | `number` | warehouse ID | `-1` |
| ★ | `skuKey` | `string` | sku_key | `-` |
| ○ | `standard_type` | `string` | 품목 이름 | `-` |
| ○ | `working_status` | `string enum: COMPLETE, CANCEL, NONE` | 작업 상태 | `COMPLETE` |
| ★ | `stCount` | `number` | 품목 수량 | `-1` |
| ★ | `locRaw` | `string` | 위치 정보 | `-` |
| ○ | `task_type` | `string enum: NONE, INPUT, OUTPUT, MOVE` | 입고, 출고, 이동 | `NONE` |
| ○ | `batch_number` | `string` | 배치 번호 | `-` |
| ★ | `orderNumber` | `string` | 오더 번호 | `-` |
| ★ | `orderFlow` | `string` | 오더 순서 | `-` |
| ★ | `jobDate` | `string (date-time)` | 작업 일자 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | job 내역 생성 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (JobHistoryResponseDto)
★     id: number // job 내역 ID [default: -1] [example: 1]
★     palletId: number // 팔레트 ID [default: -1] [example: rfid8372]
★     warehouseId: number // 창고 Id [example: 1]
★     skuKey: string // 아이템 키 [example: 1]
★     workingStatus: string // 작업 상태 [example: 작업 중]
★     stCount: number // 품목 수량 [example: 1]
★     locRaw: string // 위치 정보 [example: 1-1-1]
★     taskType: string // 입고, 출고, 이동 [example: 입고]
★     createDate: string (date-time) // 생성 날짜 [example: 2026-04-14T07:04:56.222Z]
```

### PUT /job-history/update-job-history/{jobHistoryId}

`PUT /job-history/update-job-history/{jobHistoryId}`

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `jobHistoryId` | `number` | - | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateJobHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `palletId` | `number` | pallet ID | `-1` |
| ○ | `warehouseId` | `number` | warehouse ID | `-1` |
| ○ | `skuKey` | `string` | sku_key | `-` |
| ○ | `standard_type` | `string` | 품목 이름 | `-` |
| ○ | `working_status` | `string enum: COMPLETE, CANCEL, NONE` | 작업 상태 | `COMPLETE` |
| ○ | `stCount` | `number` | 품목 수량 | `-1` |
| ○ | `locRaw` | `string` | 위치 정보 | `-` |
| ○ | `task_type` | `string enum: NONE, INPUT, OUTPUT, MOVE` | 입고, 출고, 이동 | `NONE` |
| ○ | `batch_number` | `string` | 배치 번호 | `-` |
| ○ | `orderNumber` | `string` | 오더 번호 | `-` |
| ○ | `orderFlow` | `string` | 오더 순서 | `-` |
| ○ | `jobDate` | `string (date-time)` | 작업 일자 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | - | - |

## MAIL

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/mail/send` | POST /mail/send |

### POST /mail/send

`POST /mail/send`

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `MailRequestDto`

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `201` | - | - |

## MESSAGE-DISPATCH-HISTORY

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/message-dispatch-history/get-by-history-id` | 히스토리에 해당하는 메세지 전송 이력 |

### 히스토리에 해당하는 메세지 전송 이력

`POST /message-dispatch-history/get-by-history-id`

- 설명: 히스토리에 해당하는 메세지 전송 이력

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringMessageDispatchHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ○ | `id` | `number` | ID | `1` |
| ○ | `alarmHistoryId` | `number` | 히스토리 ID 목록 | `1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 메세지 전송 이력 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (MessageDispatchHistoryResponseDto)>
★       messageDispatchHistoryId: number // ID [default: -1]
★       type: string // 전송 타입
★       message: string // 전송 내용
★       dispatchSuccess: boolean // 전송 성공 여부 [default: true]
★       createDate: string (date-time) // 생성(전송) 날짜 [default: 2026-04-14T07:04:56.123Z]
★       usersId: string // 전송된 유저 ID
★       usersSeqId: number // 전송된 유저 Seq ID [default: -1]
★       userName: string // 작성자 이름
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

## NOTI

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/noti/get-all-noti` | 모든 공지 조회 |
| `POST` | `/noti/get-recently-noti-list` | 최근 공지 조회 |
| `POST` | `/noti/get-noti-by-id` | 특정 공지 조회 |
| `POST` | `/noti/create-noti` | 공지 등록 |
| `PUT` | `/noti/update-noti/{notiId}` | 공지 수정 |
| `DELETE` | `/noti/soft-delete-noti/{notiId}` | 공지 삭제 |

### 모든 공지 조회

`POST /noti/get-all-noti`

- 설명: 등록된 모든 공지 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringNotiDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ○ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `-` |
| ○ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `-` |
| ○ | `keyword` | `string` | 조회 키워드 | `-` |
| ○ | `notiId` | `number` | 공지 ID | `-1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 공지 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (NotiResponseDto)>
★       notiId: number // 공지사항 ID [default: -1]
★       title: string // 공지사항 제목
★       content: string // 공지사항 내용
★       createDate: string (date-time) // 공지사항 작성 날짜
★       updateDate: string (date-time) // 공지사항 수정 날짜
★       usersId: string // 공지사항 작성자 ID
★       usersSeqId: number // 공지사항 작성자 Seq ID [default: -1]
★       userName: string // 공지사항 작성자 이름
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

### 최근 공지 조회

`POST /noti/get-recently-noti-list`

- 설명: 최근 공지 조회

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 최근 공지 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (Array)
```

### 특정 공지 조회

`POST /noti/get-noti-by-id`

- 설명: 특정 공지 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 특정 공지 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (NotiResponseDto)
★     notiId: number // 공지사항 ID [default: -1]
★     title: string // 공지사항 제목
★     content: string // 공지사항 내용
★     createDate: string (date-time) // 공지사항 작성 날짜
★     updateDate: string (date-time) // 공지사항 수정 날짜
★     usersId: string // 공지사항 작성자 ID
★     usersSeqId: number // 공지사항 작성자 Seq ID [default: -1]
★     userName: string // 공지사항 작성자 이름
```

### 공지 등록

`POST /noti/create-noti`

- 설명: 공지 등록

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateNotiDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `title` | `string` | 공지사항 제목 | `-` |
| ★ | `content` | `string` | 공지사항 내용 | `-` |
| ★ | `usersSeqId` | `number` | 공지사항 작성자 Seq ID | `0` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 공지 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (NotiResponseDto)
★     notiId: number // 공지사항 ID [default: -1]
★     title: string // 공지사항 제목
★     content: string // 공지사항 내용
★     createDate: string (date-time) // 공지사항 작성 날짜
★     updateDate: string (date-time) // 공지사항 수정 날짜
★     usersId: string // 공지사항 작성자 ID
★     usersSeqId: number // 공지사항 작성자 Seq ID [default: -1]
★     userName: string // 공지사항 작성자 이름
```

### 공지 수정

`PUT /noti/update-noti/{notiId}`

- 설명: 공지 수정

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `notiId` | `number` | 공지 ID | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateNotiDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `title` | `string` | 공지사항 제목 | `-` |
| ○ | `content` | `string` | 공지사항 내용 | `-` |
| ○ | `usersSeqId` | `number` | 공지사항 작성자 Seq ID | `0` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 공지 수정 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 공지 삭제

`DELETE /noti/soft-delete-noti/{notiId}`

- 설명: 공지 삭제

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `notiId` | `number` | 공지 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 공지 삭제 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

## REALTIME-VIEW

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/realtime-view/get-all-realtime-view` | 실시간 설비 상태 목록 |

### 실시간 설비 상태 목록

`POST /realtime-view/get-all-realtime-view`

- 설명: 실시간 설비 상태 목록

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringRealtimeEquipmentViewDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `id` | `number` | Realtime View ID | `-1` |
| ★ | `equipmentId` | `number` | 장비 ID | `-1` |
| ★ | `status` | `string enum: START, STOP, FAULT, UNKNOWN` | 현재 상태 | `-` |
| ★ | `taskType` | `string enum: NONE, INPUT, OUTPUT, MOVE` | 가동 유형 | `-` |
| ★ | `actionType` | `string enum: NONE, MOVE_HORIZONTAL, MOVE_VERTICAL, UNLOAD, LOAD` | 작업 유형 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 실시간 설비 상태 목록 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (RealtimeEquipmentViewResponseDto)
★     id: number // Realtime Equipment View ID [default: -1]
★     equipmentCode: string // 장비 코드 [example: G111]
★     speed: number // 현재 속도 [default: 0] [example: 0]
★     status: string enum: START, STOP, FAULT, UNKNOWN // 현재 상태 [default: UNKNOWN] [example: START]
★     x: number // 위치 정보 x [default: 0] [example: 0]
★     y: number // 위치 정보 y [default: 0] [example: 0]
★     z: number // 위치 정보 z [default: 0] [example: 0]
★     taskType: string enum: NONE, INPUT, OUTPUT, MOVE // 가동 유형 [default: NONE] [example: MOVE]
★     productStandard: string // 타이어 규격 [example: winter-tire]
★     productCount: number // 타이어 개수 [example: 0]
★     createDate: number // 생성 날짜 [default: -1] [example: 1]
★     equipmentTypeId: number // 장비 유형 ID [example: 1]
★     equipmentTypeName: string // 장비 유형 [example: GANTRY]
★     equipmentId: number // 장비 ID [example: 1]
★     equipmentName: string // 장비 이름 [example: GANTRY 1-1-1]
★     twinStatus: string enum: DEFAULT, LEFT, RIGHT // TWIN 포크 위치 [default: DEFAULT] [example: DEFAULT]
★     loaded: boolean // 팔레트 적재 여부 [example: false]
★     action: string enum: NONE, MOVE_HORIZONTAL, MOVE_VERTICAL, UNLOAD, LOAD // 작업 유형 [default: NONE] [example: NONE]
```

## REALTIME-WAREHOUSE-VIEW

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/realtime-warehouse-view/get-realtime-warehouse-view` | 설비 가동 뷰 조회 |
| `PUT` | `/realtime-warehouse-view/update/{id}` | 설비 가동 뷰 수정 |

### 설비 가동 뷰 조회

`POST /realtime-warehouse-view/get-realtime-warehouse-view`

- 설명: 설비 가동 뷰 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringRealtimeWarehouseViewDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ★ | `id` | `number` | ID | `-1` |
| ★ | `loaded` | `boolean` | loaded | `true` |
| ★ | `useType` | `string enum: NORMAL, SHIPPING, RESERVED, MODIFYING, UNSHIPPED, DOUBLE_STOCK, CHECK_STOCK` | shelf 사용 유형 | `NORMAL` |
| ★ | `warehouseId` | `number` | 창고 ID | `0` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 가동 뷰 조회 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (RealtimeWarehouseViewResponseDto)
★     equipmentCode: string // 설비 코드 [example: G111]
★     id: number // 설비 가동 뷰 ID [default: -1]
★     x: number // bay [default: 0]
★     y: number // bank [default: 0]
★     z: number // level [default: 0]
★     loaded: boolean // Pallet 적재 여부 [default: true] [example: true]
★     useType: string enum: NORMAL, SHIPPING, RESERVED, MODIFYING, UNSHIPPED, DOUBLE_STOCK, CHECK_STOCK // shelf 사용 유형 [default: NORMAL]
★     warehouseId: number // 창고 ID [default: -1]
★     warehouseType: string enum: CRANE, GANTRY, ETC, GTR // 창고 타입 [default: CRANE]
★     productStandard: string // 타이어 규격 [example: winter-tire]
★     productCount: number // 타이어 개수 [example: 0]
```

### 설비 가동 뷰 수정

`PUT /realtime-warehouse-view/update/{id}`

- 설명: 설비 가동 뷰 수정

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `id` | `number` | - | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateRealtimeWarehouseViewDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `equipmentCode` | `string` | 설비 코드 | `G111` |
| ○ | `loc_x` | `number` | 위치정보 x | `0` |
| ○ | `loc_y` | `number` | 위치정보 y | `0` |
| ○ | `loc_z` | `number` | 위치정보 z | `0` |
| ○ | `loaded` | `boolean` | Pallet 적재 여부 | `true` |
| ○ | `useType` | `string enum: NORMAL, SHIPPING, RESERVED, MODIFYING, UNSHIPPED, DOUBLE_STOCK, CHECK_STOCK` | shelf 사용 유형 | `NORMAL` |
| ○ | `warehouseId` | `number` | 창고 ID | `0` |
| ○ | `standardType` | `string` | 타이어 규격 | `winter-tire` |
| ○ | `stCount` | `number` | 타이어 개수 | `0` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 설비 가동 뷰 수정 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

## ROOT

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/` | GET / |

### GET /

`GET /`

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | - | - |

## SETTING

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/setting/system` | 모든 시스템 조회 |
| `PUT` | `/setting/system` | 시스템 수정 |
| `POST` | `/setting/remote/get-all-remote` | POST /setting/remote/get-all-remote |
| `POST` | `/setting/remote/get-remote-by-user-seq-id` | POST /setting/remote/get-remote-by-user-seq-id |
| `POST` | `/setting/remote/create-remote` | POST /setting/remote/create-remote |
| `PUT` | `/setting/remote/update-remote/{remoteId}` | PUT /setting/remote/update-remote/{remoteId} |
| `DELETE` | `/setting/remote/delete-remote/{remoteId}` | DELETE /setting/remote/delete-remote/{remoteId} |

### 모든 시스템 조회

`GET /setting/system`

- 설명: 모든 시스템 조회

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 시스템 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (SystemResponseDto)
★     id: number // 시스템 ID [default: -1]
★     createDate: string (date-time) // 시스템 생성 날짜
★     updateDate: string (date-time) // 시스템 수정 날짜
★     alarmSendEnabled: boolean // 알람 전송 여부 [default: true]
★     equipmentAlarmEnabled: boolean // 설비 알람 전송 여부 [default: true]
★     inventoryAlarmEnabled: boolean // 재고 알람 전송 여부 [default: true]
★     inventoryAlarmRemainingDay: number // 장기 재고 남은 일수 [default: 50]
★     loadWarningRatioCrane: number // Crane 경고 비율 [default: 80]
★     loadDangerRatioCrane: number // Crane 위험 비율 [default: 90]
★     loadWarningColorCrane: string // Crane 경고 색상 [default: ##FF00FF]
★     loadDangerColorCrane: string // Crane 위험 색상 [default: ##FF00FF]
★     loadWarningRatioGantry: number // Gantry 경고 비율 [default: 80]
★     loadDangerRatioGantry: number // Gantry 위험 비율 [default: 90]
★     loadWarningColorGantry: string // Gantry 경고 색상 [default: ##FF00FF]
★     loadDangerColorGantry: string // Gantry 위험 색상 [default: ##FF00FF]
```

### 시스템 수정

`PUT /setting/system`

- 설명: 시스템 수정

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateSystemDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `alarm_send_enabled` | `boolean` | 알람 전송 여부 | `true` |
| ○ | `equipment_alarm_enabled` | `boolean` | 설비 알람 전송 여부 | `true` |
| ○ | `inventory_alarm_enabled` | `boolean` | 재고 알람 전송 여부 | `true` |
| ○ | `inventory_alarm_remaining_day` | `number` | 장기 재고 남은 일수 | `50` |
| ○ | `load_warning_ratio_crane` | `number` | Crane 경고 비율 | `80` |
| ○ | `load_danger_ratio_crane` | `number` | Crane 위험 비율 | `90` |
| ○ | `load_warning_color_crane` | `string` | Crane 경고 색상 | `##FF00FF` |
| ○ | `load_danger_color_crane` | `string` | Crane 위험 색상 | `##FF00FF` |
| ○ | `load_warning_ratio_gantry` | `number` | Gantry 경고 비율 | `80` |
| ○ | `load_danger_ratio_gantry` | `number` | Gantry 위험 비율 | `90` |
| ○ | `load_warning_color_gantry` | `string` | Gantry 경고 색상 | `##FF00FF` |
| ○ | `load_danger_color_gantry` | `string` | Gantry 위험 색상 | `##FF00FF` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 시스템 수정 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### POST /setting/remote/get-all-remote

`POST /setting/remote/get-all-remote`

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `201` | - | - |

### POST /setting/remote/get-remote-by-user-seq-id

`POST /setting/remote/get-remote-by-user-seq-id`

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringRemoteDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `remoteId` | `number` | 원격 ID | `-1` |
| ○ | `userSeqId` | `number` | 사용자 Seq ID | `-1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `201` | - | - |

### POST /setting/remote/create-remote

`POST /setting/remote/create-remote`

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateRemoteDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `location` | `string` | 위치 | `test` |
| ★ | `ip` | `string` | IP | `000.000.000.000` |
| ★ | `port` | `number` | 포트 | `8080` |
| ★ | `seq_id` | `number` | 사용자 Seq ID | `1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `201` | - | - |

### PUT /setting/remote/update-remote/{remoteId}

`PUT /setting/remote/update-remote/{remoteId}`

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `remoteId` | `number` | - | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateRemoteDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `location` | `string` | 위치 | `test` |
| ○ | `ip` | `string` | IP | `000.000.000.000` |
| ○ | `port` | `number` | 포트 | `8080` |
| ○ | `seq_id` | `number` | 사용자 Seq ID | `1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | - | - |

### DELETE /setting/remote/delete-remote/{remoteId}

`DELETE /setting/remote/delete-remote/{remoteId}`

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `remoteId` | `number` | - | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | - | - |

## SHIPPING-SPECIFICATION

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/shipping-specification/get-shipping-specification-list` | 모든 중점 출고 규격 데이터 조회 |
| `POST` | `/shipping-specification/create-shipping-specification` | 중점 출고 규격 데이터 등록 |
| `POST` | `/shipping-specification/get-daily-shipping-specification` | 일별 중점 출고 규격 데이터 |
| `POST` | `/shipping-specification/get-shipping-specification/{shippingSpecificationId}` | 특정 중점 출고 규격 데이터 조회 |
| `POST` | `/shipping-specification/get-current-month-shipment` | 이번달 중점 출고 규격 출하량 |
| `PUT` | `/shipping-specification/update-shipping-specification/{shippingSpecificationId}` | 중점 출고 규격 데이터 수정 |
| `DELETE` | `/shipping-specification/soft-delete-shipping-specification/{shippingSpecificationId}` | 중점 출고 규격 데이터 삭제 |

### 모든 중점 출고 규격 데이터 조회

`POST /shipping-specification/get-shipping-specification-list`

- 설명: 모든 중점 출고 규격 데이터 조회

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 중점 출고 규격 데이터 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (ShippingSpecificationResponseDto)>
★       shippingSpecificationId: number // 중점 출고 규격 데이터 ID [default: -1]
★       createDate: string (date-time) // 데이터 생성 날짜
★       updateDate: string (date-time) // 데이터 변경 날짜
★       standardType: string // 타이어타입
★       validRecord: boolean // 사용 여부 [default: true]
★       usersId: string // 사용자 ID
★       usersSeqId: number // 사용자 Seq ID [default: -1]
★       userName: string // 사용자 이름
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

### 중점 출고 규격 데이터 등록

`POST /shipping-specification/create-shipping-specification`

- 설명: 중점 출고 규격 데이터 등록

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateShippingSpecificationDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `standard_type` | `string` | 중점 출고 규격 | `-` |
| ★ | `users_seq_id` | `number` | 사용자 Seq ID | `-1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 중점 출고 규격 데이터 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ShippingSpecificationResponseDto)
★     shippingSpecificationId: number // 중점 출고 규격 데이터 ID [default: -1]
★     createDate: string (date-time) // 데이터 생성 날짜
★     updateDate: string (date-time) // 데이터 변경 날짜
★     standardType: string // 타이어타입
★     validRecord: boolean // 사용 여부 [default: true]
★     usersId: string // 사용자 ID
★     usersSeqId: number // 사용자 Seq ID [default: -1]
★     userName: string // 사용자 이름
```

### 일별 중점 출고 규격 데이터

`POST /shipping-specification/get-daily-shipping-specification`

- 설명: 일별 중점 출고 규격 데이터

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringDateDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `2025-07-10T08:00:00` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `2025-07-10T10:00:00` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 일별 중점 출고 규격 데이터 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (DailyShippingSpecificationDto)
★     date: string // 날짜 [example: 2023-10-01]
★     items: array<string> // 타이어 규격 별 개수 [example: [object Object]]
```

### 특정 중점 출고 규격 데이터 조회

`POST /shipping-specification/get-shipping-specification/{shippingSpecificationId}`

- 설명: 특정 중점 출고 규격 데이터 조회

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `shippingSpecificationId` | `number` | 중점 출고 규격 데이터 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 특정 중점 출고 규격 데이터 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ShippingSpecificationResponseDto)
★     shippingSpecificationId: number // 중점 출고 규격 데이터 ID [default: -1]
★     createDate: string (date-time) // 데이터 생성 날짜
★     updateDate: string (date-time) // 데이터 변경 날짜
★     standardType: string // 타이어타입
★     validRecord: boolean // 사용 여부 [default: true]
★     usersId: string // 사용자 ID
★     usersSeqId: number // 사용자 Seq ID [default: -1]
★     userName: string // 사용자 이름
```

### 이번달 중점 출고 규격 출하량

`POST /shipping-specification/get-current-month-shipment`

- 설명: 이번달 중점 출고 규격 출하량

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 이번달 중점 출고 규격 출하량 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (MonthShipmentDto)
★     standardType: string // 타이어 규격
★     outCount: number // 월별 출하 개수 [default: -1]
★     stackedCount: number // 월별 재고 개수 [default: -1]
```

### 중점 출고 규격 데이터 수정

`PUT /shipping-specification/update-shipping-specification/{shippingSpecificationId}`

- 설명: 중점 출고 규격 데이터 수정

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `shippingSpecificationId` | `number` | 중점 출고 규격 데이터 ID | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateShippingSpecificationDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `standard_type` | `string` | 중점 출고 규격 | `-` |
| ○ | `users_seq_id` | `number` | 사용자 Seq ID | `-1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 중점 출고 규격 데이터 수정 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 중점 출고 규격 데이터 삭제

`DELETE /shipping-specification/soft-delete-shipping-specification/{shippingSpecificationId}`

- 설명: 중점 출고 규격 데이터 삭제

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `shippingSpecificationId` | `number` | 중점 출고 규격 데이터 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 중점 출고 규격 데이터삭제 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

## SSE

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/sse/events` | GET /sse/events |

### GET /sse/events

`GET /sse/events`

#### Query Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `query` | ★ | `clientId` | `string` | - | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | - | - |

## TODO

| Method | Path | Summary |
| --- | --- | --- |
| `POST` | `/todo/get-all` | 모든 할 일 조회 |
| `POST` | `/todo/get/{todoId}` | 특정 할 일 조회 |
| `POST` | `/todo/get-all-with-attainment` | 모든 (달성률)할 일 조회 |
| `POST` | `/todo/create` | 할 일 등록 |
| `PUT` | `/todo/update/{todoId}` | 할 일 수정 |
| `DELETE` | `/todo/delete/{todoId}/soft` | 할 일 삭제 |

### 모든 할 일 조회

`POST /todo/get-all`

- 설명: 등록된 모든 할 일 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringTodoDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ○ | `todoId` | `number` | Todo ID | `-1` |
| ○ | `alarmProcessFlag` | `boolean` | 알람 처리 여부 | `false` |
| ○ | `targetStartDate` | `string (date-time)` | 목표일-조회시작일 | `null` |
| ○ | `targetEndDate` | `string (date-time)` | 목표일-조회종료일 | `null` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 할 일 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (TodoResponseDto)>
★       todoId: number // ID [default: -1]
★       targetCount: number // 목표량 [default: -1] [example: 100]
★       description: string // 내용
★       standardType: string // 타이어 규격
★       targetDate: string (date-time) // 목표 날짜 [default: 2026-04-14T07:04:56.251Z]
★       createDate: string (date-time) // 작성 날짜 [default: 2026-04-14T07:04:56.251Z]
★       updateDate: string (date-time) // 수정 날짜 [default: 2026-04-14T07:04:56.251Z]
★       alarmOffsetHours: number // 알람 발생 시간 [default: -1]
★       usersId: string // 작성자 ID
★       usersSeqId: number // 작성자 Seq ID [default: -1]
★       userName: string // 작성자 이름
★       targetStartDate: string (date-time) // 목표 시작일 [default: 2026-04-14T07:04:56.251Z]
★       targetEndDate: string (date-time) // 목표 종료일 [default: 2026-04-14T07:04:56.251Z]
★       alarmProcessFlag: boolean // 알람 전송 여부 [default: false]
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

### 특정 할 일 조회

`POST /todo/get/{todoId}`

- 설명: 특정 할 일 조회

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `todoId` | `number` | 할 일 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 특정 할 일 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (TodoResponseDto)
★     todoId: number // ID [default: -1]
★     targetCount: number // 목표량 [default: -1] [example: 100]
★     description: string // 내용
★     standardType: string // 타이어 규격
★     targetDate: string (date-time) // 목표 날짜 [default: 2026-04-14T07:04:56.251Z]
★     createDate: string (date-time) // 작성 날짜 [default: 2026-04-14T07:04:56.251Z]
★     updateDate: string (date-time) // 수정 날짜 [default: 2026-04-14T07:04:56.251Z]
★     alarmOffsetHours: number // 알람 발생 시간 [default: -1]
★     usersId: string // 작성자 ID
★     usersSeqId: number // 작성자 Seq ID [default: -1]
★     userName: string // 작성자 이름
★     targetStartDate: string (date-time) // 목표 시작일 [default: 2026-04-14T07:04:56.251Z]
★     targetEndDate: string (date-time) // 목표 종료일 [default: 2026-04-14T07:04:56.251Z]
★     alarmProcessFlag: boolean // 알람 전송 여부 [default: false]
```

### 모든 (달성률)할 일 조회

`POST /todo/get-all-with-attainment`

- 설명: 등록된 모든 (달성률)할 일 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringTodoDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ○ | `todoId` | `number` | Todo ID | `-1` |
| ○ | `alarmProcessFlag` | `boolean` | 알람 처리 여부 | `false` |
| ○ | `targetStartDate` | `string (date-time)` | 목표일-조회시작일 | `null` |
| ○ | `targetEndDate` | `string (date-time)` | 목표일-조회종료일 | `null` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 (달성률)할 일 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (AttainmentTodoDto)>
○       todoId: number // ID [default: -1]
○       targetCount: number // 목표량 [default: -1] [example: 100]
○       description: string // 내용
○       standardType: string // 타이어 규격
○       targetDate: string (date-time) // 목표 날짜 [default: 2026-04-14T07:04:56.251Z]
○       createDate: string (date-time) // 작성 날짜 [default: 2026-04-14T07:04:56.251Z]
○       updateDate: string (date-time) // 수정 날짜 [default: 2026-04-14T07:04:56.251Z]
○       alarmOffsetHours: number // 알람 발생 시간 [default: -1]
○       usersId: string // 작성자 ID
○       usersSeqId: number // 작성자 Seq ID [default: -1]
○       userName: string // 작성자 이름
○       targetStartDate: string (date-time) // 목표 시작일 [default: 2026-04-14T07:04:56.251Z]
○       targetEndDate: string (date-time) // 목표 종료일 [default: 2026-04-14T07:04:56.251Z]
○       alarmProcessFlag: boolean // 알람 전송 여부 [default: false]
★       attainmentCount: number // 달성량 [default: -1] [example: 57]
★       attainmentRate: number // 달성률 [default: 0] [example: 33.33]
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

### 할 일 등록

`POST /todo/create`

- 설명: 할 일 등록

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateTodoDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `targetStartDate` | `string (date-time)` | 목표 날짜 | `2026-04-14T07:04:56.251Z` |
| ★ | `targetEndDate` | `string (date-time)` | 목표 날짜 | `2026-04-14T07:04:56.251Z` |
| ★ | `targetCount` | `number` | 목표량 | `-1` |
| ★ | `standardType` | `string` | 타이어 규격 | `-` |
| ★ | `description` | `string` | 내용 | `-` |
| ★ | `alarmOffsetHours` | `number` | 알람 발생 시간 | `1` |
| ★ | `alarmProcessFlag` | `boolean` | 알람 전송 여부 | `false` |
| ★ | `usersSeqId` | `number` | 작성자 Seq ID | `1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 할 일 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (TodoResponseDto)
★     todoId: number // ID [default: -1]
★     targetCount: number // 목표량 [default: -1] [example: 100]
★     description: string // 내용
★     standardType: string // 타이어 규격
★     targetDate: string (date-time) // 목표 날짜 [default: 2026-04-14T07:04:56.251Z]
★     createDate: string (date-time) // 작성 날짜 [default: 2026-04-14T07:04:56.251Z]
★     updateDate: string (date-time) // 수정 날짜 [default: 2026-04-14T07:04:56.251Z]
★     alarmOffsetHours: number // 알람 발생 시간 [default: -1]
★     usersId: string // 작성자 ID
★     usersSeqId: number // 작성자 Seq ID [default: -1]
★     userName: string // 작성자 이름
★     targetStartDate: string (date-time) // 목표 시작일 [default: 2026-04-14T07:04:56.251Z]
★     targetEndDate: string (date-time) // 목표 종료일 [default: 2026-04-14T07:04:56.251Z]
★     alarmProcessFlag: boolean // 알람 전송 여부 [default: false]
```

### 할 일 수정

`PUT /todo/update/{todoId}`

- 설명: 할 일 수정

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `todoId` | `number` | 할 일 ID | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateTodoDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ○ | `targetStartDate` | `string (date-time)` | 목표 날짜 | `2026-04-14T07:04:56.251Z` |
| ○ | `targetEndDate` | `string (date-time)` | 목표 날짜 | `2026-04-14T07:04:56.251Z` |
| ○ | `targetCount` | `number` | 목표량 | `-1` |
| ○ | `standardType` | `string` | 타이어 규격 | `-` |
| ○ | `description` | `string` | 내용 | `-` |
| ○ | `alarmOffsetHours` | `number` | 알람 발생 시간 | `1` |
| ○ | `alarmProcessFlag` | `boolean` | 알람 전송 여부 | `false` |
| ○ | `usersSeqId` | `number` | 작성자 Seq ID | `1` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 할 일 수정 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 할 일 삭제

`DELETE /todo/delete/{todoId}/soft`

- 설명: 할 일 삭제

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `todoId` | `number` | 할 일 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 할 일 삭제 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

## USERS

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/users` | 모든 사용자 조회 |
| `GET` | `/users/check` | 사용자 아이디 확인 결과
      - true: 존재하지 않는 아이디(회원가입가능)
      - false: 존재하는 아이디(회원가입불가) |
| `GET` | `/users/{seqId}` | 특정 사용자 조회 |
| `POST` | `/users/signup` | 회원가입 |
| `POST` | `/users/login` | 로그인 |
| `POST` | `/users/id` | 아이디 찾기 |
| `POST` | `/users/send-code` | 이메일 인증 코드 발송 |
| `POST` | `/users/confirm-code` | 이메일 인증 코드 확인 |
| `POST` | `/users/{seqId}/logout` | 로그아웃 |
| `POST` | `/users/{seqId}/validate-password` | 비밀번호 확인 |
| `PATCH` | `/users/unblock` | 사용자 차단 해제 |
| `PATCH` | `/users/{seqId}/info` | (비밀번호 제외한) 회원정보 업데이트 |
| `PATCH` | `/users/{seqId}/refresh` | Access Token 재발급 |
| `PATCH` | `/users/temp-password` | 임시 비밀번호 발급 |
| `PATCH` | `/users/{seqId}/block` | 사용자 차단 |
| `DELETE` | `/users/{seqId}/soft` | 사용자 비활성화 |
| `GET` | `/users/{userSeqId}/role` | GET /users/{userSeqId}/role |
| `POST` | `/users/{userSeqId}/role` | POST /users/{userSeqId}/role |
| `DELETE` | `/users/{userSeqId}/role/{roleId}/soft` | DELETE /users/{userSeqId}/role/{roleId}/soft |
| `DELETE` | `/users/{userSeqId}/role/soft` | DELETE /users/{userSeqId}/role/soft |
| `POST` | `/users/history/get-users-login-history` | 특정 로그인 이력 조회 |
| `POST` | `/users/history/insert-login-history` | 로그인 이력 추가 |

### 모든 사용자 조회

`GET /users`

- 설명: 등록된 모든 사용자 조회

#### Query Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `query` | ★ | `page` | `number` | 페이지번호 | `1` |
| `query` | ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| `query` | ○ | `startDate` | `string` | 검색 시작 날짜 | `-` |
| `query` | ○ | `endDate` | `string` | 검색 종료 날짜 | `-` |
| `query` | ○ | `keyword` | `string` | 필터링 키워드 : 이름|소속|전화번호|이메일 | `-` |
| `query` | ○ | `seqId` | `number` | 사용자 Seq ID | `-1` |
| `query` | ○ | `seqIdList` | `array<number>` | 사용자 Seq ID 리스트 | `[]` |
| `query` | ○ | `userId` | `string` | 사용자 ID | `-` |
| `query` | ○ | `email` | `string` | 사용자 이메일 | `-` |
| `query` | ○ | `phoneNumber` | `string` | 사용자 전화번호 | `-` |
| `query` | ○ | `validRecord` | `boolean` | 사용자 탈퇴 여부 | `true` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 사용자 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (PaginationResponseDto)
★     data: array<object (UsersResponseDto)>
★       userSeqId: number // 사용자 seq ID [default: -1] [example: 1]
★       userId: string // 사용자 아이디 [example: user_id]
★       name: string // 사용자 이름 [example: John Doe]
★       phoneNumber: string // 전화번호 [example: 010-1234-1234]
★       createDate: string (date-time) // 생성날짜 [example: 2023-01-01 00:00:00]
★       updateDate: string (date-time) // 업데이트 날짜 [example: 2023-01-01 00:00:00]
★       affiliation: string // 소속 [example: 개발팀]
★       email: string // 이메일 [example: example@test.com]
★     total: number // 전체 개수 [example: 123]
★     totalPages: number // 전체 페이지 수 [example: 13]
★     currentPage: number // 현재 페이지 번호 [example: 1]
```

### 사용자 아이디 확인 결과
      - true: 존재하지 않는 아이디(회원가입가능)
      - false: 존재하는 아이디(회원가입불가)

`GET /users/check`

- 설명: 사용자 아이디 확인 결과

#### Query Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `query` | ★ | `userId` | `string` | 확인할 사용자 아이디 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 사용자 아이디 존재 여부 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 특정 사용자 조회

`GET /users/{seqId}`

- 설명: 요청된 사용자의 정보를 조회

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `seqId` | `number` | 조회할 사용자 번호 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 사용자 정보 반환 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (UsersResponseDto)
★     userSeqId: number // 사용자 seq ID [default: -1] [example: 1]
★     userId: string // 사용자 아이디 [example: user_id]
★     name: string // 사용자 이름 [example: John Doe]
★     phoneNumber: string // 전화번호 [example: 010-1234-1234]
★     createDate: string (date-time) // 생성날짜 [example: 2023-01-01 00:00:00]
★     updateDate: string (date-time) // 업데이트 날짜 [example: 2023-01-01 00:00:00]
★     affiliation: string // 소속 [example: 개발팀]
★     email: string // 이메일 [example: example@test.com]
```

### 회원가입

`POST /users/signup`

- 설명: 회원가입

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateUsersDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `userId` | `string` | 유저 로그인 ID | `-` |
| ★ | `password` | `string` | 비밀번호 | `-` |
| ★ | `email` | `string` | 이메일 | `-` |
| ★ | `name` | `string` | 이름 | `-` |
| ★ | `affiliation` | `string` | 소속 | `-` |
| ★ | `phoneNumber` | `string` | 국제전화번호 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 회원가입 성공 여부 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (UsersResponseDto)
★     userSeqId: number // 사용자 seq ID [default: -1] [example: 1]
★     userId: string // 사용자 아이디 [example: user_id]
★     name: string // 사용자 이름 [example: John Doe]
★     phoneNumber: string // 전화번호 [example: 010-1234-1234]
★     createDate: string (date-time) // 생성날짜 [example: 2023-01-01 00:00:00]
★     updateDate: string (date-time) // 업데이트 날짜 [example: 2023-01-01 00:00:00]
★     affiliation: string // 소속 [example: 개발팀]
★     email: string // 이메일 [example: example@test.com]
```

### 로그인

`POST /users/login`

- 설명: 로그인

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `LoginReqDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `userId` | `string` | 로그인 ID | `-` |
| ★ | `password` | `string` | 비밀번호 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 사용자 정보 반환 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (LoginResponseDto)
★     userSeqId: number // 사용자 seq ID [default: -1] [example: 1]
★     accessToken: string // Access Token
★     refreshToken: string // Refresh Token
```

### 아이디 찾기

`POST /users/id`

- 설명: 사용자 아이디 찾기

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FindUserIdReqDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `emailOrPhoneNumber` | `string` | 이메일 또는 휴대폰 번호 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 사용자 아이디 정보 반환 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (FindedUserIdResponseDto)
★     userId: string // 사용자 Login ID [example: userId]
```

### 이메일 인증 코드 발송

`POST /users/send-code`

- 설명: 이메일 인증 코드 발송

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `SendCertifyEmailReqDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `email` | `string` | 이메일 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 이메일 인증 코드 발송 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (String)
```

### 이메일 인증 코드 확인

`POST /users/confirm-code`

- 설명: 이메일 인증 코드 확인

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `SendCodeDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `email` | `string` | 이메일 | `-` |
| ★ | `code` | `string` | 인증코드 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 이메일 인증 코드 확인 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 로그아웃

`POST /users/{seqId}/logout`

- 설명: 로그아웃

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `seqId` | `number` | 조회할 사용자 번호 | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `RefreshTokenReqDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `refreshToken` | `string` | refresh token 정보 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 로그아웃 성공 여부 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 비밀번호 확인

`POST /users/{seqId}/validate-password`

- 설명: 비밀번호 확인

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `seqId` | `number` | 비밀번호를 확인할 사용자 번호 | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 비밀번호 확인 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 사용자 차단 해제

`PATCH /users/unblock`

- 설명: 사용자 차단 해제

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `LoginReqDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `userId` | `string` | 로그인 ID | `-` |
| ★ | `password` | `string` | 비밀번호 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 사용자 차단 해제 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### (비밀번호 제외한) 회원정보 업데이트

`PATCH /users/{seqId}/info`

- 설명: (비밀번호 제외한) 회회원정보 업데이트

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `seqId` | `number` | 회원정보를 업데이트할 사용자 번호 | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `UpdateUsersDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `password` | `string` | 비밀번호 | `-` |
| ★ | `name` | `string` | 이름 | `-` |
| ★ | `phoneNumber` | `string` | 전화번호 | `-` |
| ★ | `affiliation` | `string` | 소속 | `-` |
| ★ | `email` | `string` | 이메일 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 회원정보 업데이트 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### Access Token 재발급

`PATCH /users/{seqId}/refresh`

- 설명: Access Token 재발급

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `seqId` | `number` | 조회할 사용자 번호 | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `RefreshTokenReqDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `refreshToken` | `string` | refresh token 정보 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 사용자 정보 반환 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (AccessTokenResponseDto)
★     accessToken: string [example: eyJhbGciOiJIUzI1NiIsInR5cCI...]
```

### 임시 비밀번호 발급

`PATCH /users/temp-password`

- 설명: 임시 비밀번호 발급

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `TempPasswordDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `userId` | `string` | 사용자 아이디 | `-` |
| ★ | `email` | `string` | 이메일 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 임시 비밀번호 발급 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 사용자 차단

`PATCH /users/{seqId}/block`

- 설명: 사용자 차단

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `seqId` | `number` | 차단할 사용자 번호 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 사용자 차단 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### 사용자 비활성화

`DELETE /users/{seqId}/soft`

- 설명: 사용자 비활성화

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `seqId` | `number` | 비활성화할 사용자 번호 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 사용자 비활성화 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```

### GET /users/{userSeqId}/role

`GET /users/{userSeqId}/role`

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `userSeqId` | `number` | - | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | - | - |

### POST /users/{userSeqId}/role

`POST /users/{userSeqId}/role`

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `userSeqId` | `number` | - | `-` |

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateRoleDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `type` | `string enum: , ADMIN` | 권한 유형 | `-` |
| ★ | `description` | `string` | 상세 내역 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `201` | - | - |

### DELETE /users/{userSeqId}/role/{roleId}/soft

`DELETE /users/{userSeqId}/role/{roleId}/soft`

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `roleId` | `number` | - | `-` |
| `path` | ★ | `userSeqId` | `number` | - | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | - | - |

### DELETE /users/{userSeqId}/role/soft

`DELETE /users/{userSeqId}/role/soft`

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `userSeqId` | `number` | - | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | - | - |

### 특정 로그인 이력 조회

`POST /users/history/get-users-login-history`

- 설명: 특정 로그인 이력 조회

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `FilteringLoginHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `page` | `number` | 페이지번호 | `1` |
| ★ | `limit` | `number` | 페이지 당 항목 개수 | `10` |
| ★ | `loginHistoryId` | `number` | LoginHistory ID | `-1` |
| ★ | `userSeqId` | `number` | User ID | `-1` |
| ★ | `startDate` | `string (date-time)` | 조회 시작 날짜 | `-` |
| ★ | `endDate` | `string (date-time)` | 조회 종료 날짜 | `-` |
| ★ | `keyword` | `string` | 조회 키워드 | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 특정 로그인 이력 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (LoginHistoryResponseDto)
★     loginHistoryId: number // 로그인 이력 ID [default: -1]
★     tryIp: string // 로그인 IP
★     userSeqId: number // 사용자 Seq ID [default: -1]
★     userId: string // 사용자 ID
★     userName: string // 사용자 이름
★     createDate: string (date-time) // 로그인 날짜
```

### 로그인 이력 추가

`POST /users/history/insert-login-history`

- 설명: 로그인 이력 추가

#### Request Body

- 필수 여부: 필수
- 형식: `application/json`
- 스키마: `CreateLoginHistoryDto`

| 필수 | 필드 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- |
| ★ | `user_seq_id` | `number` | 로그인 이력 유저 시퀀스 ID | `-` |
| ★ | `try_ip` | `string` | 로그인 이력 IP | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 추가된 로그인 이력 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (LoginHistoryResponseDto)
★     loginHistoryId: number // 로그인 이력 ID [default: -1]
★     tryIp: string // 로그인 IP
★     userSeqId: number // 사용자 Seq ID [default: -1]
★     userId: string // 사용자 ID
★     userName: string // 사용자 이름
★     createDate: string (date-time) // 로그인 날짜
```

## WAREHOUSE

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/warehouse/get-all-warehouse` | 모든 창고 조회 |
| `GET` | `/warehouse/get-warehouse/{id}` | 창고 상세 조회 |
| `DELETE` | `/warehouse/soft-delete-warehouse/{id}` | 창고 데이터 삭제 |

### 모든 창고 조회

`GET /warehouse/get-all-warehouse`

- 설명: 등록된 모든 창고 조회

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 모든 창고 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (WarehouseResponseDto)
★     id: number // 창고 ID [default: -1] [example: 1]
★     createDate: string (date-time) // 정보 생성 날짜 [example: 2026-04-14T07:04:55.975Z]
★     updateDate: string (date-time) // 정보 수정 날짜 [example: 2026-04-14T07:04:55.975Z]
★     validRecord: boolean // 사용 여부 [default: true] [example: true]
★     type: string enum: CRANE, GANTRY, ETC, GTR // 창고 타입 [default: ETC] [example: ETC]
★     code: string // 창고 코드
★     name: string // 창고 이름
```

### 창고 상세 조회

`GET /warehouse/get-warehouse/{id}`

- 설명: 등록된 창고 상세 조회

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `id` | `number` | 창고 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 창고 상세 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (WarehouseResponseDto)
★     id: number // 창고 ID [default: -1] [example: 1]
★     createDate: string (date-time) // 정보 생성 날짜 [example: 2026-04-14T07:04:55.975Z]
★     updateDate: string (date-time) // 정보 수정 날짜 [example: 2026-04-14T07:04:55.975Z]
★     validRecord: boolean // 사용 여부 [default: true] [example: true]
★     type: string enum: CRANE, GANTRY, ETC, GTR // 창고 타입 [default: ETC] [example: ETC]
★     code: string // 창고 코드
★     name: string // 창고 이름
```

### 창고 데이터 삭제

`DELETE /warehouse/soft-delete-warehouse/{id}`

- 설명: 창고 데이터 삭제

#### Path Parameters

| 위치 | 필수 | 이름 | 타입 | 설명 | 기본값 |
| --- | --- | --- | --- | --- | --- |
| `path` | ★ | `id` | `number` | 창고 ID | `-` |

#### Responses

| 상태 코드 | 형식 | 설명 |
| --- | --- | --- |
| `200` | `application/json` | 창고 데이터 삭제 결과 |

**Response Schema `200`**

```text
★ response: object (ApiResponseFormat)
★   status: object (ApiResponseStatusDto)
★     isSuccess: boolean [example: true]
★     statusCode: number [example: 200]
★     message: string [example: 성공적으로 처리되었습니다.]
★   data: object (ResponseStatusDto)
★     isSuccess: boolean // 성공여부
★     message: string // 상태 메시지 [example: message]
```
