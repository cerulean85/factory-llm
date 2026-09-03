# Titan WAS API Documentation (Auto-Generated)

OpenAPI Version: 3.0.0

## App API

### /
**Endpoint**: `GET /`

---

## Alarm API

### 모든 알람 조회
**Endpoint**: `POST /alarm/get-alarm-code-list`

*Description*: 등록된 모든 알람 조회

**Request Body**:
Schema: `#/components/schemas/FilteringAlarmDto`

---

### 특정 알람 조회
**Endpoint**: `GET /alarm/{alarmId}`

*Description*: 특정 알람 조회

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmId | path | Y | number | 알람 ID |

---

### 알람 업데이트
**Endpoint**: `PUT /alarm/{alarmId}`

*Description*: 알람 업데이트

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmId | path | Y | number | 알람 ID |

**Request Body**:
Schema: `#/components/schemas/UpdateAlarmDto`

---

### 특정 알람 담당자 조회
**Endpoint**: `GET /alarm/{alarmId}/users`

*Description*: 특정 알람 담당자 조회

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmId | path | Y | number | 알람 ID |

---

### 특정 알람 담당자 추가
**Endpoint**: `PATCH /alarm/{alarmId}/users`

*Description*: 특정 알람 담당자 추가

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmId | path | Y | number | 알람 ID |

**Request Body**:
Schema: `#/components/schemas/CommonUserInfoDto`

---

### 특정 알람 담당자 삭제
**Endpoint**: `DELETE /alarm/{alarmId}/users`

*Description*: 특정 알람 담당자 삭제

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmId | path | Y | number | 알람 ID |

**Request Body**:
Schema: `#/components/schemas/CommonUserInfoDto`

---

### 메뉴얼 파일 다운로드
**Endpoint**: `GET /alarm/{alarmId}/manual/{fileId}`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmId | path | Y | number | 알람 ID |
| fileId | path | Y | number | 파일 ID |

---

### 매뉴얼 파일 삭제
**Endpoint**: `DELETE /alarm/{alarmId}/manual/{fileId}`

*Description*: 매뉴얼 파일 삭제

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmId | path | Y | number | 알람 ID |
| fileId | path | Y | number | 파일 ID |

---

### 알람 생성
**Endpoint**: `POST /alarm`

*Description*: 알람 생성

**Request Body**:
Schema: `#/components/schemas/CreateAlarmDto`

---

### 알람 CSV 업로드
**Endpoint**: `POST /alarm/upload-alarm-csv`

*Description*: 알람 CSV 업로드

---

### 알람 코드 CSV 파일 다운로드
**Endpoint**: `POST /alarm/download-alarm-csv`

---

### 알람 이름 중복 조회
**Endpoint**: `POST /alarm/check-code`

*Description*: 알람 이름 중복 조회

**Request Body**:
Schema: `#/components/schemas/CheckAlarmDto`

---

### 매뉴얼 파일 업로드
**Endpoint**: `PATCH /alarm/manual`

*Description*: 매뉴얼 파일 업로드

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmId | path | Y | number | 알람 ID |

---

### 알람 삭제
**Endpoint**: `DELETE /alarm/soft`

*Description*: 알람 삭제

**Request Body**:
Schema: `#/components/schemas/DeleteAlarmDto`

---

## Sse API

### /sse/events
**Endpoint**: `GET /sse/events`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| clientId | query | Y | string | - |

---

## EquipmentType API

### 모든 장비 유형 조회
**Endpoint**: `POST /equipment-type/get-all-equipment-type`

*Description*: 등록된 모든 장비 유형 조회

---

## 사용자 API API

### 모든 사용자 조회
**Endpoint**: `GET /users`

*Description*: 등록된 모든 사용자 조회

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| page | query | Y | number | 페이지번호 |
| limit | query | Y | number | 페이지 당 항목 개수 |
| startDate | query | N | string | 검색 시작 날짜 |
| endDate | query | N | string | 검색 종료 날짜 |
| keyword | query | N | string | 필터링 키워드 : 이름|소속|전화번호|이메일 |
| seqId | query | N | number | 사용자 Seq ID |
| seqIdList | query | N | array | 사용자 Seq ID 리스트 |
| userId | query | N | string | 사용자 ID |
| email | query | N | string | 사용자 이메일 |
| phoneNumber | query | N | string | 사용자 전화번호 |
| validRecord | query | N | boolean | 사용자 탈퇴 여부 |

---

### 사용자 아이디 확인 결과
      - true: 존재하지 않는 아이디(회원가입가능)
      - false: 존재하는 아이디(회원가입불가)
**Endpoint**: `GET /users/check`

*Description*: 사용자 아이디 확인 결과

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| userId | query | Y | string | 확인할 사용자 아이디 |

---

### 특정 사용자 조회
**Endpoint**: `GET /users/{seqId}`

*Description*: 요청된 사용자의 정보를 조회

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| seqId | path | Y | number | 조회할 사용자 번호 |

---

### 회원가입
**Endpoint**: `POST /users/signup`

*Description*: 회원가입

**Request Body**:
Schema: `#/components/schemas/CreateUsersDto`

---

### 로그인
**Endpoint**: `POST /users/login`

*Description*: 로그인

**Request Body**:
Schema: `#/components/schemas/LoginReqDto`

---

### 아이디 찾기
**Endpoint**: `POST /users/id`

*Description*: 사용자 아이디 찾기

**Request Body**:
Schema: `#/components/schemas/FindUserIdReqDto`

---

### 이메일 인증 코드 발송
**Endpoint**: `POST /users/send-code`

*Description*: 이메일 인증 코드 발송

**Request Body**:
Schema: `#/components/schemas/SendCertifyEmailReqDto`

---

### 이메일 인증 코드 확인
**Endpoint**: `POST /users/confirm-code`

*Description*: 이메일 인증 코드 확인

**Request Body**:
Schema: `#/components/schemas/SendCodeDto`

---

### 로그아웃
**Endpoint**: `POST /users/{seqId}/logout`

*Description*: 로그아웃

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| seqId | path | Y | number | 조회할 사용자 번호 |

**Request Body**:
Schema: `#/components/schemas/RefreshTokenReqDto`

---

### 비밀번호 확인
**Endpoint**: `POST /users/{seqId}/validate-password`

*Description*: 비밀번호 확인

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| seqId | path | Y | number | 비밀번호를 확인할 사용자 번호 |

**Request Body**:
Schema: `Custom`

---

### 사용자 차단 해제
**Endpoint**: `PATCH /users/unblock`

*Description*: 사용자 차단 해제

**Request Body**:
Schema: `#/components/schemas/LoginReqDto`

---

### (비밀번호 제외한) 회원정보 업데이트
**Endpoint**: `PATCH /users/{seqId}/info`

*Description*: (비밀번호 제외한) 회회원정보 업데이트

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| seqId | path | Y | number | 회원정보를 업데이트할 사용자 번호 |

**Request Body**:
Schema: `#/components/schemas/UpdateUsersDto`

---

### Access Token 재발급
**Endpoint**: `PATCH /users/{seqId}/refresh`

*Description*: Access Token 재발급

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| seqId | path | Y | number | 조회할 사용자 번호 |

**Request Body**:
Schema: `#/components/schemas/RefreshTokenReqDto`

---

### 임시 비밀번호 발급
**Endpoint**: `PATCH /users/temp-password`

*Description*: 임시 비밀번호 발급

**Request Body**:
Schema: `#/components/schemas/TempPasswordDto`

---

### 사용자 차단
**Endpoint**: `PATCH /users/{seqId}/block`

*Description*: 사용자 차단

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| seqId | path | Y | number | 차단할 사용자 번호 |

---

### 사용자 비활성화
**Endpoint**: `DELETE /users/{seqId}/soft`

*Description*: 사용자 비활성화

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| seqId | path | Y | number | 비활성화할 사용자 번호 |

---

## Mail API

### /mail/send
**Endpoint**: `POST /mail/send`

**Request Body**:
Schema: `#/components/schemas/MailRequestDto`

---

## AlarmHistory API

### 알람 내역 조회
**Endpoint**: `POST /alarm-history/get-alarm-history`

*Description*: 등록된 알람 내역 조회

**Request Body**:
Schema: `#/components/schemas/FilteringAlarmHistoryDto`

---

### 알람 내역 조회
**Endpoint**: `POST /alarm-history/get-paginated-alarm-history`

*Description*: 등록된 알람 내역 조회

**Request Body**:
Schema: `#/components/schemas/FilteringAlarmHistoryDto`

---

### 알람 내역 갱신
**Endpoint**: `POST /alarm-history/update/{alarmHistoryId}`

*Description*: 알람 내역 갱신

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| alarmHistoryId | path | Y | number | - |

**Request Body**:
Schema: `#/components/schemas/UpdateProcessAlarmHistoryDto`

---

## EquipmentAlarmHistory API

### 설비별 알람 처리 내역
**Endpoint**: `POST /alarm-history/get-process-status-by-equipment`

*Description*: 설비별 알람 처리 내역

**Request Body**:
Schema: `#/components/schemas/GettingAlarmHistoryStatisticsDto`

---

### 날짜별 알람 처리 내역
**Endpoint**: `POST /alarm-history/get-process-status-by-date`

*Description*: 날짜별 알람 처리 내역

**Request Body**:
Schema: `#/components/schemas/GettingAlarmHistoryStatisticsDto`

---

### 설비별 상위 알람 리스트
**Endpoint**: `POST /alarm-history/get-top-alarm-list-by-equipment`

*Description*: 설비별 상위 알람 리스트

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

## System API

### 모든 시스템 조회
**Endpoint**: `GET /setting/system`

*Description*: 모든 시스템 조회

---

### 시스템 수정
**Endpoint**: `PUT /setting/system`

*Description*: 시스템 수정

**Request Body**:
Schema: `#/components/schemas/UpdateSystemDto`

---

## Warehouse API

### 모든 창고 조회
**Endpoint**: `GET /warehouse/get-all-warehouse`

*Description*: 등록된 모든 창고 조회

---

### 창고 상세 조회
**Endpoint**: `GET /warehouse/get-warehouse/{id}`

*Description*: 등록된 창고 상세 조회

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | path | Y | number | 창고 ID |

---

### 창고 데이터 삭제
**Endpoint**: `DELETE /warehouse/soft-delete-warehouse/{id}`

*Description*: 창고 데이터 삭제

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | path | Y | number | 창고 ID |

---

## AlarmMessageDispatch API

### 메시지 전송
**Endpoint**: `POST /alarm-message-dispatch/send-sms`

*Description*: 성공 여부

**Request Body**:
Schema: `#/components/schemas/CreateAlarmSmsDto`

---

## MessageDispatchHistory API

### 히스토리에 해당하는 메세지 전송 이력
**Endpoint**: `POST /message-dispatch-history/get-by-history-id`

*Description*: 히스토리에 해당하는 메세지 전송 이력

**Request Body**:
Schema: `#/components/schemas/FilteringMessageDispatchHistoryDto`

---

## Equipment API

### 모든 장비 유형 조회
**Endpoint**: `POST /equipment/get-equipment-list-with-type`

*Description*: 등록된 모든 장비 유형 조회

---

## CellView API

### 셀 별 현황
**Endpoint**: `POST /cell-view/get-all-cell`

*Description*: 셀 별 현황

**Request Body**:
Schema: `#/components/schemas/FilteringCellViewDto`

---

## CraneCellView API

### 팔레트 적치 현황 개수 집계
**Endpoint**: `POST /crane-item-history/get-pallet-current-stacked-counts`

*Description*: 팔레트 적치 현황 개수 집계

---

### Crane 현황 집계
**Endpoint**: `POST /crane-item-history/get-current-crane-counts`

*Description*: Crane 현황 집계

---

### 팔레트 레벨 구간 별 적재 개수
**Endpoint**: `POST /crane-item-history/get-pallet-level-groups`

*Description*: 팔레트 레벨 구간 별 적재 개수

---

### 장기 재고 기간 별 개수
**Endpoint**: `POST /crane-item-history/get-long-product-groups`

*Description*: 장기 재고 기간 별 개수

---

## GantryCellView API

### Gantry 현황 집계
**Endpoint**: `POST /gantry-item-history/get-current-gantry-counts`

*Description*: Gantry 현황 집계

---

## UsersRole API

### /users/{userSeqId}/role
**Endpoint**: `GET /users/{userSeqId}/role`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| userSeqId | path | Y | number | - |

---

### /users/{userSeqId}/role
**Endpoint**: `POST /users/{userSeqId}/role`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| userSeqId | path | Y | number | - |

**Request Body**:
Schema: `#/components/schemas/CreateRoleDto`

---

### /users/{userSeqId}/role/{roleId}/soft
**Endpoint**: `DELETE /users/{userSeqId}/role/{roleId}/soft`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| roleId | path | Y | number | - |
| userSeqId | path | Y | number | - |

---

### /users/{userSeqId}/role/soft
**Endpoint**: `DELETE /users/{userSeqId}/role/soft`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| userSeqId | path | Y | number | - |

---

## Noti API

### 모든 공지 조회
**Endpoint**: `POST /noti/get-all-noti`

*Description*: 등록된 모든 공지 조회

**Request Body**:
Schema: `#/components/schemas/FilteringNotiDto`

---

### 최근 공지 조회
**Endpoint**: `POST /noti/get-recently-noti-list`

*Description*: 최근 공지 조회

---

### 특정 공지 조회
**Endpoint**: `POST /noti/get-noti-by-id`

*Description*: 특정 공지 조회

**Request Body**:
Schema: `Custom`

---

### 공지 등록
**Endpoint**: `POST /noti/create-noti`

*Description*: 공지 등록

**Request Body**:
Schema: `#/components/schemas/CreateNotiDto`

---

### 공지 수정
**Endpoint**: `PUT /noti/update-noti/{notiId}`

*Description*: 공지 수정

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| notiId | path | Y | number | 공지 ID |

**Request Body**:
Schema: `#/components/schemas/UpdateNotiDto`

---

### 공지 삭제
**Endpoint**: `DELETE /noti/soft-delete-noti/{notiId}`

*Description*: 공지 삭제

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| notiId | path | Y | number | 공지 ID |

---

## Remote API

### /setting/remote/get-all-remote
**Endpoint**: `POST /setting/remote/get-all-remote`

---

### /setting/remote/get-remote-by-user-seq-id
**Endpoint**: `POST /setting/remote/get-remote-by-user-seq-id`

**Request Body**:
Schema: `#/components/schemas/FilteringRemoteDto`

---

### /setting/remote/create-remote
**Endpoint**: `POST /setting/remote/create-remote`

**Request Body**:
Schema: `#/components/schemas/CreateRemoteDto`

---

### /setting/remote/update-remote/{remoteId}
**Endpoint**: `PUT /setting/remote/update-remote/{remoteId}`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| remoteId | path | Y | number | - |

**Request Body**:
Schema: `#/components/schemas/UpdateRemoteDto`

---

### /setting/remote/delete-remote/{remoteId}
**Endpoint**: `DELETE /setting/remote/delete-remote/{remoteId}`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| remoteId | path | Y | number | - |

---

## JobHistory API

### job 내역 생성
**Endpoint**: `POST /job-history/create-job-history`

*Description*: job 내역 생성

**Request Body**:
Schema: `#/components/schemas/CreateJobHistoryDto`

---

### /job-history/update-job-history/{jobHistoryId}
**Endpoint**: `PUT /job-history/update-job-history/{jobHistoryId}`

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| jobHistoryId | path | Y | number | - |

**Request Body**:
Schema: `#/components/schemas/UpdateJobHistoryDto`

---

## GantryJobHistory API

### 일별 갠트리 출고 현황
**Endpoint**: `POST /gantry-item-history/get-daily-gantry-out-counts`

*Description*: 일별 갠트리 출고 현황

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

## CraneJobHistory API

### 일별 크레인 출고 현황
**Endpoint**: `POST /crane-item-history/get-daily-crane-out-counts`

*Description*: 일별 크레인 출고 현황

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

### 일별 크레인 적치 현황
**Endpoint**: `POST /crane-item-history/get-daily-crane-stacked-counts`

*Description*: 일별 크레인 적치 현황

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

### 월별 크레인 출고 현황
**Endpoint**: `POST /crane-item-history/get-monthly-crane-counts`

*Description*: 월별 크레인 출고 현황

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

### 상위 타입 및 일별 조회
**Endpoint**: `POST /crane-item-history/get-daily-top-standard-types-counts`

*Description*: 상위 타입 및 일별 조회

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

## ItemMasterView API

### 아이템 마스터 뷰
**Endpoint**: `POST /item-master-view/get-all-item-master-view`

*Description*: 아이템 마스터 뷰

**Request Body**:
Schema: `#/components/schemas/FilteringItemMasterViewDto`

---

## ShippingSpecification API

### 모든 중점 출고 규격 데이터 조회
**Endpoint**: `POST /shipping-specification/get-shipping-specification-list`

*Description*: 모든 중점 출고 규격 데이터 조회

---

### 중점 출고 규격 데이터 등록
**Endpoint**: `POST /shipping-specification/create-shipping-specification`

*Description*: 중점 출고 규격 데이터 등록

**Request Body**:
Schema: `#/components/schemas/CreateShippingSpecificationDto`

---

### 일별 중점 출고 규격 데이터
**Endpoint**: `POST /shipping-specification/get-daily-shipping-specification`

*Description*: 일별 중점 출고 규격 데이터

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

### 특정 중점 출고 규격 데이터 조회
**Endpoint**: `POST /shipping-specification/get-shipping-specification/{shippingSpecificationId}`

*Description*: 특정 중점 출고 규격 데이터 조회

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| shippingSpecificationId | path | Y | number | 중점 출고 규격 데이터 ID |

---

### 이번달 중점 출고 규격 출하량
**Endpoint**: `POST /shipping-specification/get-current-month-shipment`

*Description*: 이번달 중점 출고 규격 출하량

---

### 중점 출고 규격 데이터 수정
**Endpoint**: `PUT /shipping-specification/update-shipping-specification/{shippingSpecificationId}`

*Description*: 중점 출고 규격 데이터 수정

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| shippingSpecificationId | path | Y | number | 중점 출고 규격 데이터 ID |

**Request Body**:
Schema: `#/components/schemas/UpdateShippingSpecificationDto`

---

### 중점 출고 규격 데이터 삭제
**Endpoint**: `DELETE /shipping-specification/soft-delete-shipping-specification/{shippingSpecificationId}`

*Description*: 중점 출고 규격 데이터 삭제

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| shippingSpecificationId | path | Y | number | 중점 출고 규격 데이터 ID |

---

## Todo API

### 모든 할 일 조회
**Endpoint**: `POST /todo/get-all`

*Description*: 등록된 모든 할 일 조회

**Request Body**:
Schema: `#/components/schemas/FilteringTodoDto`

---

### 특정 할 일 조회
**Endpoint**: `POST /todo/get/{todoId}`

*Description*: 특정 할 일 조회

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| todoId | path | Y | number | 할 일 ID |

---

### 모든 (달성률)할 일 조회
**Endpoint**: `POST /todo/get-all-with-attainment`

*Description*: 등록된 모든 (달성률)할 일 조회

**Request Body**:
Schema: `#/components/schemas/FilteringTodoDto`

---

### 할 일 등록
**Endpoint**: `POST /todo/create`

*Description*: 할 일 등록

**Request Body**:
Schema: `#/components/schemas/CreateTodoDto`

---

### 할 일 수정
**Endpoint**: `PUT /todo/update/{todoId}`

*Description*: 할 일 수정

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| todoId | path | Y | number | 할 일 ID |

**Request Body**:
Schema: `#/components/schemas/UpdateTodoDto`

---

### 할 일 삭제
**Endpoint**: `DELETE /todo/delete/{todoId}/soft`

*Description*: 할 일 삭제

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| todoId | path | Y | number | 할 일 ID |

---

## EquipmentOperationHistory API

### 설비 가동 내역 전체 조회
**Endpoint**: `POST /equipment-operation-history/get-pagination`

*Description*: 설비 가동 내역 전체 조회

**Request Body**:
Schema: `#/components/schemas/PaginationRequestDto`

---

### 설비 가동 내역 집계
**Endpoint**: `POST /equipment-operation-history/get-aggregation`

*Description*: 설비 가동 내역 집계

**Request Body**:
Schema: `#/components/schemas/GettingEquipmentOperationStatusDto`

---

### 설비 가동 내역 수정
**Endpoint**: `PUT /equipment-operation-history/update/{id}`

*Description*: 설비 가동 내역 수정

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | path | Y | number | - |

**Request Body**:
Schema: `#/components/schemas/UpdateEquipmentOperationHistoryDto`

---

## DashBoard API

### 대시보드
**Endpoint**: `POST /dash-board/get-dash-board`

*Description*: 대시보드

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

## DockView API

### 도크 별 출하 현황
**Endpoint**: `POST /dock-view/get-all-dock`

*Description*: 도크 별 출하 현황

**Request Body**:
Schema: `#/components/schemas/FilteringDockViewDto`

---

## EquipmentOperationMaintenance API

### 설비 가동 보수 이력 생성
**Endpoint**: `POST /equipment-operation-maintenance/create`

*Description*: 설비 가동 보수 이력 생성

**Request Body**:
Schema: `#/components/schemas/CreateEquipmentOperationMaintenanceDto`

---

### 설비 가동 보수 이력 조회
**Endpoint**: `POST /equipment-operation-maintenance/get-pagination`

*Description*: 설비 가동 보수 이력 조회

**Request Body**:
Schema: `#/components/schemas/FilteringEquipmentOperationMaintenanceDto`

---

### 설비 가동 보수 이력 집계
**Endpoint**: `POST /equipment-operation-maintenance/get-aggregation`

*Description*: 설비 보수 이력 집계

**Request Body**:
Schema: `#/components/schemas/FilteringDateDto`

---

### 설비 가동 보수 이력 수정
**Endpoint**: `PUT /equipment-operation-maintenance/update/{id}`

*Description*: 설비 가동 보수 이력 수정

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | path | Y | number | - |

**Request Body**:
Schema: `#/components/schemas/UpdateEquipmentOperationMaintenanceDto`

---

## RealtimeEquipmentView API

### 실시간 설비 상태 목록
**Endpoint**: `POST /realtime-view/get-all-realtime-view`

*Description*: 실시간 설비 상태 목록

**Request Body**:
Schema: `#/components/schemas/FilteringRealtimeEquipmentViewDto`

---

## RealtimeWarehouseView API

### 설비 가동 뷰 조회
**Endpoint**: `POST /realtime-warehouse-view/get-realtime-warehouse-view`

*Description*: 설비 가동 뷰 조회

**Request Body**:
Schema: `#/components/schemas/FilteringRealtimeWarehouseViewDto`

---

### 설비 가동 뷰 수정
**Endpoint**: `PUT /realtime-warehouse-view/update/{id}`

*Description*: 설비 가동 뷰 수정

**Parameters**:
| Name | In | Required | Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | path | Y | number | - |

**Request Body**:
Schema: `#/components/schemas/UpdateRealtimeWarehouseViewDto`

---

## LoginHistory API

### 모든 로그인 이력 조회
**Endpoint**: `POST /history/get-all-login-history`

*Description*: 모든 로그인 이력 조회

**Request Body**:
Schema: `#/components/schemas/FilteringLoginHistoryDto`

---

## UsersLoginHistory API

### 특정 로그인 이력 조회
**Endpoint**: `POST /users/history/get-users-login-history`

*Description*: 특정 로그인 이력 조회

**Request Body**:
Schema: `#/components/schemas/FilteringLoginHistoryDto`

---

### 로그인 이력 추가
**Endpoint**: `POST /users/history/insert-login-history`

*Description*: 로그인 이력 추가

**Request Body**:
Schema: `#/components/schemas/CreateLoginHistoryDto`

---

## Data Schemas

- `ApiResponseStatusDto`
- `ApiResponseFormat`
- `PaginationResponseDto`
- `CommonUserInfoDto`
- `FileResponseDto`
- `AlarmResponseDto`
- `FilteringAlarmDto`
- `CreateAlarmDto`
- `ResponseStatusDto`
- `CheckAlarmDto`
- `UpdateAlarmDto`
- `Array`
- `DeleteAlarmDto`
- `EquipmentTypeResponseDto`
- `UsersResponseDto`
- `CreateUsersDto`
- `LoginResponseDto`
- `LoginReqDto`
- `FindedUserIdResponseDto`
- `FindUserIdReqDto`
- `String`
- `SendCertifyEmailReqDto`
- `SendCodeDto`
- `RefreshTokenReqDto`
- `UpdateUsersDto`
- `AccessTokenResponseDto`
- `TempPasswordDto`
- `MailRequestDto`
- `AlarmHistoryBaseResponseDto`
- `EquipmentAlarmHistoryResponseDto`
- `InventoryAlarmHistoryResponseDto`
- `AggregatedAlarmHistoryResponseDto`
- `FilteringEquipmentAlarmHistoryDto`
- `FilteringInventoryAlarmHistoryDto`
- `FilteringPalletAlarmHistoryDto`
- `FilteringAlarmHistoryDto`
- `UpdateProcessAlarmHistoryDto`
- `EquipmentAlarmProcessStatusDto`
- `AlarmProcessEquipmentStatisticsDto`
- `GettingAlarmHistoryStatisticsDto`
- `DailyAlarmProcessStatusDto`
- `AlarmProcessDailyStatisticsDto`
- `AlarmItemDto`
- `EquipmentUnitDto`
- `TopAlarmResponseByEquipmentDto`
- `FilteringDateDto`
- `SystemResponseDto`
- `UpdateSystemDto`
- `WarehouseResponseDto`
- `CreateAlarmSmsDto`
- `MessageDispatchHistoryResponseDto`
- `FilteringMessageDispatchHistoryDto`
- `CellViewResponseDto`
- `FilteringCellViewDto`
- `CraneCellCurrentStackedCountsDto`
- `CellStackedCountsDto`
- `PalletGroupsResponseDto`
- `LongProductItemsResponseDto`
- `LongProductResponseDto`
- `CreateRoleDto`
- `NotiResponseDto`
- `FilteringNotiDto`
- `CreateNotiDto`
- `UpdateNotiDto`
- `FilteringRemoteDto`
- `CreateRemoteDto`
- `UpdateRemoteDto`
- `JobHistoryResponseDto`
- `CreateJobHistoryDto`
- `UpdateJobHistoryDto`
- `DailyStatusCountsDto`
- `MonthlyStatusCountsDto`
- `StandardTypesDailyCountsDto`
- `ItemMasterViewResponseDto`
- `FilteringItemMasterViewDto`
- `ShippingSpecificationResponseDto`
- `CreateShippingSpecificationDto`
- `DailyShippingSpecificationDto`
- `MonthShipmentDto`
- `UpdateShippingSpecificationDto`
- `TodoResponseDto`
- `FilteringTodoDto`
- `AttainmentTodoDto`
- `CreateTodoDto`
- `UpdateTodoDto`
- `EquipmentOperationResponseDto`
- `PaginationRequestDto`
- `EquipmentOperationHistoryAggregationDto`
- `GettingEquipmentOperationStatusDto`
- `UpdateEquipmentOperationHistoryDto`
- `PalletCurrentCountsDto`
- `AlarmHistoryEquipmentStatusDto`
- `DashBoardResponseDto`
- `DockViewResponseDto`
- `FilteringDockViewDto`
- `EquipmentOperationMaintenanceResponseDto`
- `CreateEquipmentOperationMaintenanceDto`
- `FilteringEquipmentOperationMaintenanceDto`
- `EquipmentOperationMaintenanceAggregationDto`
- `UpdateEquipmentOperationMaintenanceDto`
- `RealtimeEquipmentViewResponseDto`
- `FilteringRealtimeEquipmentViewDto`
- `RealtimeWarehouseViewResponseDto`
- `FilteringRealtimeWarehouseViewDto`
- `UpdateRealtimeWarehouseViewDto`
- `LoginHistoryResponseDto`
- `FilteringLoginHistoryDto`
- `CreateLoginHistoryDto`
