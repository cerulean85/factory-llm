# Derived API Specification

이 문서는 현재 코드베이스의 컨트롤러와 요청 DTO를 기준으로 역도출한 API 명세다.  
목표는 Swagger 요약보다 더 실무적으로, "어떤 API가 있고 무엇을 보내야 하는지"를 바로 파악할 수 있게 하는 것이다.

## Scope

- 기준 코드: `src/main.ts`, `src/app.module.ts`, 활성 `*.controller.ts`
- Swagger UI: `/api-docs`
- 글로벌 prefix: 없음
- 기본 포트: `SERVICE_PORT` 또는 `3300`
- 제외: `src/domains/__archived__/**`

## Global Rules

### Authentication

- 기본 인증: `Authorization: Bearer <accessToken>`
- JWT payload 필드: `seqId`, `userId`, `email`, `name`
- 토큰 만료: access `5m`, refresh `1d`

주의:

- `JwtServiceAuthGuard`는 `DEBUG_JWT_ENABLED === false`면 인증을 실제로 검사하지 않는다.
- 즉 코드상 `UseGuards(...)`가 붙어 있어도 개발 설정에 따라 인증 우회가 가능하다.

### Common Response Format

대부분의 JSON 응답은 글로벌 인터셉터에 의해 아래 형식으로 감싸진다.

```json
{
  "status": {
    "isSuccess": true,
    "statusCode": 200,
    "message": "Request has been successfully processed."
  },
  "data": {}
}
```

예외:

- SSE 응답
- 파일 다운로드 응답
- `@Res()`를 직접 쓰는 일부 컨트롤러

### Common Pagination

공통 페이지 파라미터:

- `page`: number, 기본 `1`
- `limit`: number, 기본 `10`, 최대 `100`

공통 페이지 응답:

- `data`
- `total`
- `totalPages`
- `currentPage`

### Common Date Filter

여러 API에서 아래 형식을 반복 사용한다.

- `startDate`: 날짜/시간
- `endDate`: 날짜/시간

일부 서비스는 내부적으로 `startDate`를 당일 시작 시각, `endDate`를 당일 종료 시각으로 보정한다.

## API Summary

### Health / Infra

| Method | Path | Auth | 설명 |
| --- | --- | --- | --- |
| GET | `/` | N | 기본 헬스/샘플 응답 |
| GET | `/sse/events?clientId=...` | N | 브라우저 실시간 이벤트 스트림 연결 |

### Users

| Method | Path | Auth | 설명 |
| --- | --- | --- | --- |
| GET | `/users` | Y | 사용자 목록 조회 |
| GET | `/users/check` | N | 로그인 ID 중복 확인 |
| GET | `/users/:seqId` | Y | 특정 사용자 조회 |
| POST | `/users/signup` | N | 회원가입 |
| POST | `/users/login` | N | 로그인 |
| POST | `/users/id` | N | 이메일/전화번호 기반 아이디 찾기 |
| POST | `/users/send-code` | N | 이메일 인증코드 발송 |
| POST | `/users/confirm-code` | N | 이메일 인증코드 확인 |
| POST | `/users/:seqId/logout` | Y | 로그아웃 |
| POST | `/users/:seqId/validate-password` | Y | 비밀번호 검증 |
| PATCH | `/users/unblock` | N | 사용자 차단 해제 |
| PATCH | `/users/:seqId/info` | Y | 회원정보 수정 |
| PATCH | `/users/:seqId/refresh` | N | access token 재발급 |
| PATCH | `/users/temp-password` | N | 임시 비밀번호 발급 |
| PATCH | `/users/:seqId/block` | Y | 사용자 차단 |
| DELETE | `/users/:seqId/soft` | Y | 사용자 비활성화 |

### User Role / Login History

| Method | Path | Auth | 설명 |
| --- | --- | --- | --- |
| GET | `/users/:userSeqId/role` | Y | 사용자 권한 목록 조회 |
| POST | `/users/:userSeqId/role` | Y | 사용자 권한 추가 |
| DELETE | `/users/:userSeqId/role/:roleId/soft` | Y | 특정 권한 제거 |
| DELETE | `/users/:userSeqId/role/soft` | Y | 사용자 권한 전체 제거 |
| POST | `/history/get-all-login-history` | Y | 로그인 이력 전체 조회 |
| POST | `/users/history/get-users-login-history` | Y | 특정 사용자 로그인 이력 조회 |

### Notification / Todo

| Method | Path | Auth | 설명 |
| --- | --- | --- | --- |
| POST | `/noti/get-all-noti` | Y | 공지 목록 조회 |
| POST | `/noti/get-recently-noti-list` | Y | 최근 공지 묶음 조회 |
| POST | `/noti/get-noti-by-id` | Y | 공지 단건 조회 |
| POST | `/noti/create-noti` | Y | 공지 생성 |
| PUT | `/noti/update-noti/:notiId` | Y | 공지 수정 |
| DELETE | `/noti/soft-delete-noti/:notiId` | Y | 공지 삭제 |
| POST | `/todo/get-all` | Y | Todo 목록 조회 |
| POST | `/todo/get/:todoId` | Y | Todo 단건 조회 |
| POST | `/todo/get-all-with-attainment` | Y | 달성률 포함 Todo 목록 조회 |
| POST | `/todo/create` | Y | Todo 생성 |
| PUT | `/todo/update/:todoId` | Y | Todo 수정 |
| DELETE | `/todo/delete/:todoId/soft` | Y | Todo 삭제 |

### Alarm / Alarm History

| Method | Path | Auth | 설명 |
| --- | --- | --- | --- |
| POST | `/alarm/get-alarm-code-list` | Y | 알람 코드 목록 조회 |
| GET | `/alarm/:alarmId` | Y | 알람 단건 조회 |
| GET | `/alarm/:alarmId/users` | Y | 알람 담당자 조회 |
| GET | `/alarm/:alarmId/manual/:fileId` | Y | 매뉴얼 파일 다운로드 |
| POST | `/alarm` | Y | 알람 생성 |
| POST | `/alarm/upload-alarm-csv` | Y | 알람 CSV 업로드 |
| POST | `/alarm/download-alarm-csv` | Y | 알람 CSV 다운로드 |
| POST | `/alarm/check-code` | Y | 알람 코드 중복 확인 |
| PUT | `/alarm/:alarmId` | Y | 알람 수정 |
| PATCH | `/alarm/manual` | Y | 매뉴얼 파일 업로드 |
| PATCH | `/alarm/:alarmId/users` | Y | 알람 담당자 추가 |
| DELETE | `/alarm/soft` | Y | 알람 소프트 삭제 |
| DELETE | `/alarm/:alarmId/users` | Y | 알람 담당자 제거 |
| DELETE | `/alarm/:alarmId/manual/:fileId` | Y | 매뉴얼 파일 삭제 |
| POST | `/alarm-history/get-alarm-history` | Y | 알람 이력 조회 |
| POST | `/alarm-history/get-paginated-alarm-history` | N 코드상 | 알람 이력 페이징 조회 |
| POST | `/alarm-history/update/:alarmHistoryId` | Y | 알람 조치 내역 갱신 |
| POST | `/alarm-history/get-process-status-by-equipment` | N 코드상 | 설비별 처리 통계 |
| POST | `/alarm-history/get-process-status-by-date` | Y | 날짜별 처리 통계 |
| POST | `/alarm-history/get-top-alarm-list-by-equipment` | Y | 설비별 상위 알람 조회 |
| POST | `/message-dispatch-history/get-by-history-id` | Y | 메시지 발송 이력 조회 |
| POST | `/alarm-message-dispatch/send-sms` | Y | 알람 SMS 발송 |

### Equipment / View / Dashboard / Warehouse

| Method | Path | Auth | 설명 |
| --- | --- | --- | --- |
| POST | `/equipment/get-equipment-list-with-type` | Y | 장비+유형 목록 조회 |
| POST | `/equipment-type/get-all-equipment-type` | Y | 장비 유형 목록 조회 |
| POST | `/equipment-operation-history/get-pagination` | Y | 설비 가동 이력 조회 |
| POST | `/equipment-operation-history/get-aggregation` | Y | 설비 가동 이력 집계 |
| PUT | `/equipment-operation-history/update/:id` | Y | 설비 가동 이력 수정 |
| POST | `/dash-board/get-dash-board` | N 코드상 | 대시보드 조회 |
| POST | `/realtime-view/get-all-realtime-view` | N 코드상 | 실시간 설비 뷰 조회 |
| POST | `/cell-view/get-all-cell` | N 코드상 | 셀 현황 조회 |
| POST | `/crane-item-history/get-pallet-current-stacked-counts` | N 코드상 | 크레인 팔레트 적치 수 |
| POST | `/crane-item-history/get-current-crane-counts` | N 코드상 | 크레인 현황 집계 |
| POST | `/crane-item-history/get-pallet-level-groups` | N 코드상 | 팔레트 레벨별 집계 |
| POST | `/crane-item-history/get-long-product-groups` | N 코드상 | 장기 재고 구간 집계 |
| POST | `/gantry-item-history/get-current-gantry-counts` | N 코드상 | 갠트리 현황 집계 |
| POST | `/dock-view/get-all-dock` | Y | 도크 출하 현황 조회 |
| POST | `/item-master-view/get-all-item-master-view` | Y | 품목 마스터 뷰 조회 |
| GET | `/warehouse/get-all-warehouse` | Y | 창고 목록 조회 |
| GET | `/warehouse/get-warehouse/:id` | Y | 창고 단건 조회 |
| DELETE | `/warehouse/soft-delete-warehouse/:id` | Y | 창고 삭제 |

### Shipping / Remote / Job / Mail / System

| Method | Path | Auth | 설명 |
| --- | --- | --- | --- |
| POST | `/shipping-specification/get-shipping-specification-list` | Y | 중점 출고 규격 목록 조회 |
| POST | `/shipping-specification/create-shipping-specification` | Y | 중점 출고 규격 생성 |
| POST | `/shipping-specification/get-daily-shipping-specification` | Y | 일별 출고 규격 조회 |
| POST | `/shipping-specification/get-shipping-specification/:shippingSpecificationId` | Y | 출고 규격 단건 조회 |
| POST | `/shipping-specification/get-current-month-shipment` | Y | 월간 출하량 조회 |
| PUT | `/shipping-specification/update-shipping-specification/:shippingSpecificationId` | Y | 출고 규격 수정 |
| DELETE | `/shipping-specification/soft-delete-shipping-specification/:shippingSpecificationId` | Y | 출고 규격 삭제 |
| POST | `/setting/remote/get-all-remote` | Y | 원격 접속 정보 전체 조회 |
| POST | `/setting/remote/get-remote-by-user-seq-id` | Y | 사용자별 원격 접속 정보 조회 |
| POST | `/setting/remote/create-remote` | Y | 원격 접속 정보 생성 |
| PUT | `/setting/remote/update-remote/:remoteId` | Y | 원격 접속 정보 수정 |
| DELETE | `/setting/remote/delete-remote/:remoteId` | Y | 원격 접속 정보 삭제 |
| POST | `/job-history/create-job-history` | Y | 작업 이력 생성 |
| PUT | `/job-history/update-job-history/:jobHistoryId` | Y | 작업 이력 수정 |
| POST | `/crane-item-history/get-daily-crane-out-counts` | Y | 일별 크레인 출고 통계 |
| POST | `/crane-item-history/get-daily-crane-stacked-counts` | N 코드상 | 일별 크레인 적치 통계 |
| POST | `/crane-item-history/get-monthly-crane-counts` | Y | 월별 크레인 통계 |
| POST | `/crane-item-history/get-daily-top-standard-types-counts` | Y | 상위 규격 일별 통계 |
| POST | `/gantry-item-history/get-daily-gantry-out-counts` | N 코드상 | 일별 갠트리 출고 통계 |
| POST | `/mail/send` | Y | 메일 발송 |
| GET | `/setting/system` | Y | 시스템 설정 조회 |
| PUT | `/setting/system` | Y | 시스템 설정 수정 |
| GET | `/setting/system/refresh-browser` | N | 브라우저 새로고침 플래그 조회 |

## Detailed Request Parameters

아래부터는 DTO명을 거의 쓰지 않고 실제 request 파라미터를 직접 적는다.

### 1. Users

#### `GET /users`

설명:

- 사용자 목록을 조회한다.
- 이름, 소속, 전화번호, 이메일, 날짜 범위 등으로 필터링할 수 있다.

Query parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호, 기본 1 |
| `limit` | number | N | 페이지 크기, 기본 10 |
| `startDate` | string/date | N | 검색 시작일 |
| `endDate` | string/date | N | 검색 종료일 |
| `keyword` | string | N | 이름/소속/전화번호/이메일 검색어 |
| `seqId` | number | N | 사용자 seq ID |
| `seqIdList` | number[] | N | 사용자 seq ID 목록 |
| `userId` | string | N | 로그인 ID |
| `email` | string | N | 이메일 |
| `phoneNumber` | string | N | 전화번호 |
| `validRecord` | boolean | N | 활성 사용자만 조회 여부 |

#### `GET /users/check`

설명:

- 회원가입 전에 로그인 ID 중복을 확인한다.

Query parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `userId` | string | Y | 확인할 로그인 ID |

#### `POST /users/signup`

설명:

- 신규 사용자를 생성한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `userId` | string | Y | 로그인 ID, 1~20자 |
| `password` | string | Y | 비밀번호, 8~16자, 특수문자 포함 |
| `email` | string | N | 이메일 |
| `name` | string | Y | 이름 |
| `affiliation` | string | N | 소속 |
| `phoneNumber` | string | N | 숫자 10~12자리 전화번호 |

Example:

```json
{
  "userId": "test_id",
  "password": "Passw0rd!",
  "email": "test@hanwha.com",
  "name": "홍길동",
  "affiliation": "연구소",
  "phoneNumber": "821012341234"
}
```

#### `POST /users/login`

설명:

- 로그인 처리 후 access/refresh token을 발급한다.
- 응답 body뿐 아니라 응답 헤더에도 토큰을 설정한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `userId` | string | Y | 로그인 ID |
| `password` | string | Y | 비밀번호 |

응답 특이점:

- 헤더 `Authorization: Bearer <accessToken>`
- 헤더 `refreshToken: <refreshToken>`

#### `POST /users/id`

설명:

- 이메일 또는 전화번호로 사용자 ID를 찾는다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `emailOrPhoneNumber` | string | Y | 이메일 또는 휴대폰 번호 |

#### `POST /users/send-code`

설명:

- 이메일 인증코드를 전송한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `email` | string | Y | 인증 메일을 받을 주소 |

#### `POST /users/confirm-code`

설명:

- 이메일과 인증코드를 검증한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `email` | string | Y | 이메일 |
| `code` | string | Y | 인증코드 |

#### `POST /users/:seqId/logout`

설명:

- refresh token을 제거해 로그아웃 처리한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `seqId` | number | Y | 사용자 seq ID |

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `refreshToken` | string | Y | 제거할 refresh token |

#### `POST /users/:seqId/validate-password`

설명:

- 특정 사용자의 현재 비밀번호가 맞는지 확인한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `seqId` | number | Y | 사용자 seq ID |

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `password` | string | Y | 검증할 비밀번호 |

#### `PATCH /users/:seqId/info`

설명:

- 비밀번호 포함 사용자 정보를 수정한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `seqId` | number | Y | 사용자 seq ID |

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `password` | string | N | 새 비밀번호 |
| `name` | string | N | 이름 |
| `phoneNumber` | string | N | 전화번호 |
| `affiliation` | string | N | 소속 |
| `email` | string | N | 이메일 |

#### `PATCH /users/:seqId/refresh`

설명:

- refresh token으로 access token을 재발급한다.
- 코드상 `seqId` path param을 받지만, 메서드 구현은 body의 `refreshToken`만 사용한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `seqId` | number | Y | URL상 필수지만 내부 사용은 불명확 |

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `refreshToken` | string | Y | refresh token |

#### `PATCH /users/temp-password`

설명:

- 사용자에게 임시 비밀번호를 발급한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `userId` | string | Y | 사용자 로그인 ID |
| `email` | string | Y | 사용자 이메일 |

### 2. User Role / Login History

#### `POST /users/:userSeqId/role`

설명:

- 특정 사용자에게 권한을 추가한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `userSeqId` | number | Y | 사용자 seq ID |

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `type` | enum | Y | 권한 유형 |
| `description` | string | N | 권한 상세 설명 |

#### `POST /history/get-all-login-history`

설명:

- 로그인 이력을 페이징 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호 |
| `limit` | number | N | 페이지 크기 |
| `loginHistoryId` | number | N | 로그인 이력 ID |
| `userSeqId` | number | N | 사용자 seq ID |
| `startDate` | string/date | N | 조회 시작일 |
| `endDate` | string/date | N | 조회 종료일 |
| `keyword` | string | N | 검색어 |

#### `POST /users/history/get-users-login-history`

설명:

- 특정 사용자의 로그인 이력만 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호 |
| `limit` | number | N | 페이지 크기 |
| `userSeqId` | number | Y | 조회 대상 사용자 seq ID |
| `startDate` | string/date | N | 조회 시작일 |
| `endDate` | string/date | N | 조회 종료일 |
| `keyword` | string | N | 검색어 |

### 3. Notification / Todo

#### `POST /noti/get-all-noti`

설명:

- 공지사항을 기간/키워드 기준으로 페이징 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호 |
| `limit` | number | N | 페이지 크기 |
| `startDate` | string/date | N | 조회 시작일 |
| `endDate` | string/date | N | 조회 종료일 |
| `keyword` | string | N | 제목/내용 검색어 |
| `notiId` | number | N | 공지 ID |

#### `POST /noti/get-noti-by-id`

설명:

- 공지 ID로 단건 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `notiId` | number | Y | 공지 ID |

#### `POST /noti/create-noti`

설명:

- 공지를 생성한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | Y | 공지 제목 |
| `content` | string | Y | 공지 내용 |
| `usersSeqId` | number | N | 작성자 seq ID |

#### `PUT /noti/update-noti/:notiId`

설명:

- 공지를 부분 수정한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `notiId` | number | Y | 공지 ID |

Body:

- `create-noti`와 동일 필드, 모두 optional

#### `POST /todo/get-all`

설명:

- Todo를 조건별로 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호 |
| `limit` | number | N | 페이지 크기 |
| `todoId` | number | N | Todo ID |
| `alarmProcessFlag` | boolean | N | 알람 처리 여부 |
| `targetStartDate` | string/date | N | 목표일 시작 |
| `targetEndDate` | string/date | N | 목표일 종료 |

#### `POST /todo/create`

설명:

- Todo를 생성한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `targetStartDate` | string/date | Y | 목표 시작일 |
| `targetEndDate` | string/date | Y | 목표 종료일 |
| `targetCount` | number | Y | 목표 수량 |
| `standardType` | string | Y | 품목/규격 |
| `description` | string | N | 설명 |
| `alarmOffsetHours` | number | N | 알람 발생 offset 시간 |
| `alarmProcessFlag` | boolean | N | 알람 전송 여부 |
| `usersSeqId` | number | N | 작성자 seq ID |

#### `PUT /todo/update/:todoId`

설명:

- Todo를 부분 수정한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `todoId` | number | Y | Todo ID |

Body:

- `create`와 동일 필드, 모두 optional

### 4. Alarm

#### `POST /alarm/get-alarm-code-list`

설명:

- 알람 코드를 조건별로 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호 |
| `limit` | number | N | 페이지 크기 |
| `alarmTypeList` | enum[] | N | 알람 타입 목록 |
| `importanceList` | string | N | 중요도 목록, 코드상 CSV 문자열 |
| `manualValid` | string | N | 매뉴얼 등록 여부 |
| `sendEnabled` | string | N | 전송 사용 여부 |
| `keyword` | string | N | 검색어 |
| `keywordTypeList` | string | N | 검색 대상 필드 목록, 코드상 CSV 문자열 |
| `id` | number | N | 알람 ID |
| `validRecord` | boolean | N | 삭제되지 않은 레코드만 조회 여부 |
| `code` | string | N | 알람 코드 |
| `equipmentTypeId` | number | N | 설비 유형 ID |

#### `POST /alarm`

설명:

- 알람 정의를 생성한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `code` | string | Y | 알람 코드 |
| `type` | enum | Y | 알람 타입 |
| `description` | string | N | 알람 설명 |
| `importance` | number | Y | 중요도, 1/2/3 |
| `processMethod` | string | N | 조치 방법 |
| `fileIdList` | number[] | N | 매뉴얼 파일 ID 목록 |
| `sendEnabled` | boolean | N | 알람 발송 여부 |
| `resetAvailable` | boolean | N | 리셋 조치 가능 여부 |
| `equipmentTypeId` | number | N | 설비 유형 ID |
| `userSeqIdList` | number[] | N | 담당자 사용자 seq ID 목록 |

#### `POST /alarm/check-code`

설명:

- 동일 설비 유형 내 알람 코드 중복 여부를 확인한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `alarmCode` | string | Y | 확인할 알람 코드 |
| `equipmentTypeId` | number | Y | 설비 유형 ID |

#### `PATCH /alarm/manual`

설명:

- 매뉴얼 파일을 업로드한다.

Form-data:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `file` | file[] | Y | 최대 5개, 허용 확장자 `.pdf`, `.png`, `.jpg`, `.jpeg` |

#### `PATCH /alarm/:alarmId/users`

설명:

- 특정 알람에 담당자를 추가한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `alarmId` | number | Y | 알람 ID |

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `seqId` | number | Y | 사용자 seq ID |

#### `DELETE /alarm/soft`

설명:

- 하나 이상 알람을 소프트 삭제한다.
- body는 배열이 아니라 문자열 CSV를 받는다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `alarmIdList` | string | Y | 예: `"1,2,3"` |

### 5. Alarm History / Message Dispatch

#### `POST /alarm-history/get-alarm-history`

설명:

- 알람 이력을 타입, 날짜, 조치 여부 기준으로 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호 |
| `limit` | number | N | 페이지 크기 |
| `alarmHistoryId` | number | N | 알람 이력 ID |
| `alarmTypeList` | enum[] | N | 알람 타입 목록 |
| `alarmStartDate` | string/date | N | 알람 발생 조회 시작 |
| `alarmEndDate` | string/date | N | 알람 발생 조회 종료 |
| `processType` | enum | N | 조치 여부 |
| `processStartDate` | string/date | N | 조치일 조회 시작 |
| `processEndDate` | string/date | N | 조치일 조회 종료 |
| `filteringEquipmentAlarmHistory` | object | N | 설비 알람 세부 필터 |
| `filteringInventoryAlarmHistory` | object | N | 재고 알람 세부 필터 |
| `filteringPalletAlarmHistory` | object | N | 팔레트 알람 세부 필터 |

주의:

- 세부 필터 3종은 중첩 객체이며, 이 문서에서는 상위 스펙만 확정적으로 정리했다.

#### `POST /alarm-history/update/:alarmHistoryId`

설명:

- 알람 이력의 조치일자, 조치메시지, 담당자를 갱신한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `alarmHistoryId` | number | Y | 알람 이력 ID |

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `processDate` | string/date | N | 조치일자 |
| `processMessage` | string | N | 조치 내용 |
| `userSeqIdList` | number[] | N | 담당자 seq ID 목록 |

#### `POST /alarm-history/get-process-status-by-equipment`

설명:

- 기간 내 설비별 알람 처리 통계를 집계한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `startDate` | string/date | Y | 조회 시작일 |
| `endDate` | string/date | Y | 조회 종료일 |

#### `POST /message-dispatch-history/get-by-history-id`

설명:

- 특정 알람 이력의 메시지 발송 이력을 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호 |
| `limit` | number | N | 페이지 크기 |
| `id` | number | N | 메시지 이력 ID |
| `alarmHistoryId` | number | N | 알람 이력 ID |

#### `POST /alarm-message-dispatch/send-sms`

설명:

- 특정 알람 이력 기준으로 SMS를 발송한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `message` | string | N | 발송 메시지 |
| `phoneNumber` | string | N | 국제전화번호 형식 숫자 문자열 |
| `alarmHistoryId` | number | Y | 알람 이력 ID |
| `usersSeqId` | number | Y | 전송 사용자 seq ID |

### 6. Equipment / Job / View / Dashboard

#### `POST /equipment-operation-history/get-pagination`

설명:

- 설비 가동 이력을 페이징 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `page` | number | N | 페이지 번호 |
| `limit` | number | N | 페이지 크기 |

#### `POST /equipment-operation-history/get-aggregation`

설명:

- 기간별 설비 가동 집계를 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `startDate` | string/date | Y | 조회 시작일 |
| `endDate` | string/date | Y | 조회 종료일 |

#### `PUT /equipment-operation-history/update/:id`

설명:

- 설비 가동 이력을 수정한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | number | Y | 가동 이력 ID |

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `operationStatus` | enum/number | N | 가동 상태 |
| `operationMaintenanceType` | enum | N | 보수 유형 |
| `description` | string | N | 설명 |

#### `POST /job-history/create-job-history`

설명:

- 작업 이력을 생성한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `palletId` | number | N | 팔레트 ID |
| `warehouseId` | number | N | 창고 ID |
| `skuKey` | string | N | sku key |
| `standardType` | string | N | 규격명 |
| `workingStatus` | enum | N | 작업 상태 |
| `stCount` | number | N | 수량 |
| `locRaw` | string | N | 위치 문자열 |
| `taskType` | enum | N | 입고/출고/이동 |
| `batchNumber` | string | N | 배치 번호 |
| `orderNumber` | string | N | 오더 번호 |
| `orderFlow` | string | N | 오더 순번 |
| `jobDate` | string/date | N | 작업 일시 |

#### `PUT /job-history/update-job-history/:jobHistoryId`

설명:

- 작업 이력을 부분 수정한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `jobHistoryId` | number | Y | 작업 이력 ID |

Body:

- `create-job-history`와 동일 필드, 모두 optional

#### `POST /dash-board/get-dash-board`

설명:

- 기간 기준 대시보드 집계를 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `startDate` | string/date | N | 조회 시작일 |
| `endDate` | string/date | N | 조회 종료일 |

#### `POST /realtime-view/get-all-realtime-view`

설명:

- 실시간 설비 상태 목록을 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | number | N | 뷰 ID |
| `equipmentId` | number | N | 장비 ID |
| `status` | enum | N | 현재 상태 |
| `taskType` | enum | N | 작업 유형 |
| `actionType` | enum | N | 동작 유형 |

#### `POST /cell-view/get-all-cell`

설명:

- 셀 현황을 조건별로 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `warehouseType` | enum | N | 창고 타입 |
| `warehouseCode` | string | N | 창고 코드 |
| `palletId` | number | N | 팔레트 ID |
| `locX` | number | N | bank |
| `locY` | number | N | bay |
| `locZ` | number | N | level |
| `luggageFlag` | boolean | N | 화물 존재 여부 |
| `batchNumber` | string | N | 배치 번호 |
| `orderNumber` | string | N | 오더 번호 |
| `warehouseId` | number | N | 창고 ID |
| `enable` | boolean | N | 사용 여부 |
| `InStartDate` | string/date | N | 입고 시작일 |
| `InEndDate` | string/date | N | 입고 종료일 |
| `cellStatus` | enum | N | 셀 상태 |

#### `POST /dock-view/get-all-dock`

설명:

- 도크 출하 상태를 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `dockId` | number | N | 도크 ID |
| `gantryCode` | number | N | 갠트리 코드 |
| `status` | string | N | 출고 상태 |

#### `POST /item-master-view/get-all-item-master-view`

설명:

- 품목 마스터 뷰를 조건별 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `skuKey` | string | N | sku key |
| `standardType` | string | N | 규격명 |

### 7. Shipping / Remote / System / Mail

#### `POST /shipping-specification/create-shipping-specification`

설명:

- 중점 출고 규격을 등록한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `standardType` | string | Y | 중점 출고 규격명 |
| `usersSeqId` | number | N | 작성자 seq ID |

#### `PUT /shipping-specification/update-shipping-specification/:shippingSpecificationId`

설명:

- 중점 출고 규격을 수정한다.

Path parameters:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `shippingSpecificationId` | number | Y | 출고 규격 ID |

Body:

- `create-shipping-specification`와 동일 필드, 모두 optional

#### `POST /shipping-specification/get-daily-shipping-specification`

설명:

- 기간 기준 일별 출고 규격 통계를 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `startDate` | string/date | N | 조회 시작일 |
| `endDate` | string/date | N | 조회 종료일 |

#### `POST /setting/remote/get-remote-by-user-seq-id`

설명:

- 특정 사용자에 연결된 원격 접속 정보를 조회한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `remoteId` | number | N | 원격 정보 ID |
| `userSeqId` | number | N | 사용자 seq ID |

#### `POST /setting/remote/create-remote`

설명:

- 원격 접속 정보를 생성한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `location` | string | Y | 위치명 |
| `ip` | string | Y | IP 주소 |
| `port` | number | Y | 포트 |
| `seqId` | number | Y | 사용자 seq ID |

#### `PUT /setting/system`

설명:

- 시스템 설정을 부분 수정한다.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `alarmSendEnabled` | boolean | N | 전체 알람 전송 여부 |
| `equipmentAlarmEnabled` | boolean | N | 설비 알람 전송 여부 |
| `inventoryAlarmEnabled` | boolean | N | 재고 알람 전송 여부 |
| `inventoryAlarmRemainingDay` | number | N | 장기 재고 기준 남은 일수 |
| `loadWarningRatioCrane` | number | N | 크레인 경고 비율 |
| `loadDangerRatioCrane` | number | N | 크레인 위험 비율 |
| `loadWarningColorCrane` | string | N | 크레인 경고 색상 |
| `loadDangerColorCrane` | string | N | 크레인 위험 색상 |
| `loadWarningRatioGantry` | number | N | 갠트리 경고 비율 |
| `loadDangerRatioGantry` | number | N | 갠트리 위험 비율 |
| `loadWarningColorGantry` | string | N | 갠트리 경고 색상 |
| `loadDangerColorGantry` | string | N | 갠트리 위험 색상 |
| `refreshBrowser` | boolean | N | 브라우저 강제 새로고침 플래그 |

#### `POST /mail/send`

설명:

- 메일 발송 API.

Body:

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `to` | string | Y | 수신자 이메일 주소 |
| `subject` | string | Y | 메일 제목 |
| `text` | string | Y | 메일 본문 |

## Implementation Notes

- 조회 API가 `GET`보다 `POST`로 설계된 경우가 많다.
- 일부 Swagger 데코레이터와 실제 반환 타입은 완전히 일치하지 않을 수 있다.
- `PalletController`는 활성 모듈에 있으나 공개 라우트가 없다.
- `JwtRefreshGuard`는 import 되어 있지만 refresh 엔드포인트에 실제 적용되지 않았다.
- 인증 가드가 주석 처리된 라우트는 사실상 비인증 엔드포인트다.
- 일부 path param은 URL에는 있으나 구현 내부에서 직접 사용되지 않는다. 대표적으로 `/users/:seqId/refresh`.
