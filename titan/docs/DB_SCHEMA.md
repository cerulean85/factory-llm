# 데이터베이스 스키마 (Warehouse Automation System)

---

## 테이블 목록

| # | 테이블명 | 설명 |
|---|---------|------|
| 1 | `users` | 사용자 |
| 2 | `role` | 사용자 권한 |
| 3 | `login_history` | 로그인 이력 |
| 4 | `refresh-token` | JWT Refresh Token |
| 5 | `alarm` | 알람 코드 |
| 6 | `alarm_user_relation` | 알람-담당자 매핑 |
| 7 | `alarm_history` | 알람 발생 이력 |
| 8 | `equipment_alarm_history` | 설비 알람 이력 |
| 9 | `inventory_alarm_history` | 재고 알람 이력 |
| 10 | `pallet_alarm_history` | 팔레트 알람 이력 |
| 11 | `alarm_history_process_by_user` | 알람 처리 담당자 |
| 12 | `message_dispatch_history` | 메시지 전송 이력 |
| 13 | `equipment_type` | 설비 유형 |
| 14 | `equipment` | 설비 |
| 15 | `equipment_operation_history` | 설비 가동 이력 |
| 16 | `warehouse` | 창고 |
| 17 | `pallet` | 팔레트 |
| 18 | `job_history` | 작업 이력 |
| 19 | `shipping_specification` | 출고 규격 |
| 20 | `noti` | 공지사항 |
| 21 | `todo` | 할 일 |
| 22 | `setting_system` | 시스템 설정 |
| 23 | `setting_remote` | 원격 설정 |
| 24 | `file` | 파일 |
| 25 | `cell_view` | 셀 뷰 (실시간) |
| 26 | `realtime_equipment_view` | 설비 실시간 뷰 |
| 27 | `dock_view` | 도크 뷰 |
| 28 | `item_master_view` | 품목 마스터 뷰 |
| 29 | `alarm_queue` | 알람 큐 |
| 30 | `job_queue` | 작업 큐 |

---

## 1. users

| 컬럼 | 타입 | PK | NOT NULL | UNIQUE | DEFAULT | 설명 |
|------|------|----|----------|--------|---------|------|
| seq_id | int | O | O | | auto_increment | 사용자 SEQ ID |
| user_id | varchar(30) | | O | | | 사용자 ID |
| password | varchar | | O | | | 비밀번호 (bcrypt 해시) |
| email | varchar(50) | | | | '' | 이메일 |
| name | varchar(30) | | O | | | 이름 |
| affiliation | varchar(50) | | | | '' | 소속 |
| phone_number | varchar(20) | | | | '' | 전화번호 |
| create_date | timestamp | | O | | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | O | | CURRENT_TIMESTAMP | 수정일 |
| valid_record | boolean | | O | | true | 활성 여부 |
| blocking | boolean | | O | | false | 차단 여부 |

**인덱스**: `idx_users_seq_id` (seq_id)

---

## 2. role

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | 권한 ID |
| user_seq_id | int | | users.seq_id | | | 사용자 SEQ ID |
| type | varchar(20) | | | O | 'DEFAULT' | 권한 유형 |
| description | varchar(500) | | | | '' | 설명 |
| valid_record | boolean | | | O | true | 활성 여부 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | | O | CURRENT_TIMESTAMP | 수정일 |

**FK**: `user_seq_id` → `users.seq_id` (ON DELETE CASCADE)

---

## 3. login_history

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | 이력 ID |
| users_seq_id | int | | users.seq_id | | | 사용자 SEQ ID |
| try_ip | varchar(30) | | | O | '' | 로그인 IP |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 로그인 일시 |

**FK**: `users_seq_id` → `users.seq_id` (ON DELETE CASCADE)

---

## 4. refresh-token

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | 토큰 ID |
| user_seq_id | int | | users.seq_id | | | 사용자 SEQ ID |
| refresh_token | varchar | | | | null | Refresh Token |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |
| expires_date | timestamp | | | O | CURRENT_TIMESTAMP | 만료일 |

**FK**: `user_seq_id` → `users.seq_id` (ON DELETE CASCADE)

---

## 5. alarm

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | 알람 ID |
| equipment_type_id | int | | equipment_type.id | | | 설비 유형 ID |
| code | varchar(50) | | | O | '' | 알람 코드 |
| type | varchar(50) | | | O | 'EQUIPMENT' | 알람 유형 |
| description | varchar(500) | | | | '' | 설명 |
| importance | int | | | O | 1 | 중요도 (1~3) |
| process_method | varchar(500) | | | | '' | 조치 방법 |
| file_id_list | int[] | | | | [] | 매뉴얼 파일 ID 목록 |
| send_enabled | boolean | | | O | false | 알람 전송 여부 |
| reset_available | boolean | | | O | false | 리셋 가능 여부 |
| valid_record | boolean | | | O | true | 활성 여부 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | | O | CURRENT_TIMESTAMP | 수정일 |

**FK**: `equipment_type_id` → `equipment_type.id`  
**인덱스**: `idx_alarm_id_equipment_type_id` (id, equipment_type_id)

---

## 6. alarm_user_relation

| 컬럼 | 타입 | PK | FK | NOT NULL | 설명 |
|------|------|----|----|----------|------|
| id | int | O | | O | ID |
| alarm_id | int | | alarm.id | O | 알람 ID |
| user_seq_id | int | | users.seq_id | O | 사용자 SEQ ID |

**FK**: `alarm_id` → `alarm.id` (ON DELETE CASCADE)  
**FK**: `user_seq_id` → `users.seq_id` (ON DELETE CASCADE)  
**인덱스**: `idx_alarm_user_relation_alarm_id`, `idx_alarm_user_relation_user_seq_id`

---

## 7. alarm_history

| 컬럼 | 타입 | PK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----------|---------|------|
| id | int | O | O | auto_increment | 이력 ID |
| type | varchar(10) | | O | 'EQUIPMENT' | 알람 유형 |
| message | varchar(500) | | | '' | 알람 메시지 |
| process_message | varchar(300) | | | '' | 조치 내역 |
| process_date | timestamp | | | null | 조치일 |
| create_date | timestamp | | O | CURRENT_TIMESTAMP | 발생일 |
| update_date | timestamp | | O | CURRENT_TIMESTAMP | 수정일 |

**인덱스**: `idx_alarm_type_date` (type, create_date)

---

## 8. equipment_alarm_history

| 컬럼 | 타입 | PK | FK | NOT NULL | 설명 |
|------|------|----|----|----------|------|
| id | int | O | | O | ID |
| alarm_id | int | | alarm.id | O | 알람 ID |
| alarm_history_id | int | | alarm_history.id | O | 알람 이력 ID |
| equipment_name | varchar(50) | | | O | 설비명 |
| equipment_code | varchar(50) | | | O | 설비 코드 |

**FK**: `alarm_id` → `alarm.id`  
**FK**: `alarm_history_id` → `alarm_history.id`  
**인덱스**: `idx_ea_alarm_history_id` (alarm_history_id)

---

## 9. inventory_alarm_history

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | ID |
| alarm_history_id | int | | alarm_history.id | O | | 알람 이력 ID |
| standard_type | varchar(100) | | | O | '' | 규격 종류 |
| stored_item_count | int | | | O | 0 | 재고 수량 |
| inventory_alarm_type | varchar (enum) | | | O | 'STORED' | 재고 알람 유형 |
| alert_type | varchar (enum) | | | O | 'WARNING' | 경고 유형 |
| warehouse_name | varchar(50) | | | O | '' | 창고명 |
| warehouse_code | varchar(50) | | | O | '' | 창고 코드 |
| warehouse_type | varchar (enum) | | | O | 'ETC' | 창고 유형 |

**FK**: `alarm_history_id` → `alarm_history.id`  
**인덱스**: `idx_ia_alarm_history_id` (alarm_history_id)

---

## 10. pallet_alarm_history

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | ID |
| alarm_history_id | int | | alarm_history.id | O | | 알람 이력 ID |
| warning_count | int | | | O | 0 | 경고 수량 |

**FK**: `alarm_history_id` → `alarm_history.id`  
**인덱스**: `idx_pa_alarm_history_id` (alarm_history_id)

---

## 11. alarm_history_process_by_user

| 컬럼 | 타입 | PK | FK | NOT NULL | 설명 |
|------|------|----|----|----------|------|
| id | int | O | | O | ID |
| alarm_history_id | int | | alarm_history.id | O | 알람 이력 ID |
| user_seq_id | int | | users.seq_id | O | 처리 담당자 SEQ ID |

**FK**: `alarm_history_id` → `alarm_history.id` (ON DELETE CASCADE)  
**FK**: `user_seq_id` → `users.seq_id` (ON DELETE CASCADE)  
**인덱스**: `idx_ahpbu_alarm_history_id`, `idx_ahpbu_user_seq_id`

---

## 12. message_dispatch_history

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | ID |
| alarm_history_id | int | | alarm_history.id | O | | 알람 이력 ID |
| users_seq_id | int | | users.seq_id | O | | 발송 대상 SEQ ID |
| type | varchar(20) | | | O | 'SMS' | 발송 유형 (SMS/SNS/EMAIL) |
| message | varchar(500) | | | O | '' | 메시지 내용 |
| dispatch_success | boolean | | | O | true | 발송 성공 여부 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 발송일 |

**FK**: `alarm_history_id` → `alarm_history.id`  
**FK**: `users_seq_id` → `users.seq_id`

---

## 13. equipment_type

| 컬럼 | 타입 | PK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----------|---------|------|
| id | int | O | O | auto_increment | 설비 유형 ID |
| name | varchar(50) | | O | '' | 유형명 |
| type | varchar(50) | | O | 'CNV' | 유형 (CNV/RGV/CRANE/GANTRY 등) |
| description | varchar(500) | | | '' | 설명 |
| valid_record | boolean | | O | true | 활성 여부 |
| create_date | timestamp | | O | CURRENT_TIMESTAMP | 생성일 |

**인덱스**: `idx_equipment_type_id` (id)

---

## 14. equipment

| 컬럼 | 타입 | PK | FK | NOT NULL | UNIQUE | DEFAULT | 설명 |
|------|------|----|----|----------|--------|---------|------|
| id | int | O | | O | | auto_increment | 설비 ID |
| equipment_type_id | int | | equipment_type.id | | | | 설비 유형 ID |
| warehouse_id | int | | warehouse.id | | | | 창고 ID |
| name | varchar(50) | | | O | | '' | 설비명 |
| code | varchar(50) | | | O | O | | 설비 코드 |
| spec | varchar(500) | | | | | '' | 설비 스펙 |
| valid_record | boolean | | | O | | true | 활성 여부 |
| create_date | timestamp | | | O | | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | | O | | CURRENT_TIMESTAMP | 수정일 |

**FK**: `equipment_type_id` → `equipment_type.id` (ON DELETE CASCADE)  
**FK**: `warehouse_id` → `warehouse.id` (ON DELETE CASCADE)  
**인덱스**: `idx_equipment_id_type_id` (id, equipment_type_id)

---

## 15. equipment_operation_history

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | 이력 ID |
| equipment_id | int | | equipment.id | O | | 설비 ID |
| operation_status | varchar(20) | | | O | | 가동 상태 |
| operation_maintenance_type | varchar(20) | | | O | 'DEFAULT' | 보수 유형 |
| description | varchar(500) | | | | '' | 상세 내용 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |

**FK**: `equipment_id` → `equipment.id`  
**인덱스**: `idx_equipment_id`, `idx_create_date`, `idx_equipment_create_date` (equipment_id, create_date)

---

## 16. warehouse

| 컬럼 | 타입 | PK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----------|---------|------|
| id | int | O | O | auto_increment | 창고 ID |
| name | varchar(50) | | | '' | 창고명 |
| code | varchar(50) | | | '' | 창고 코드 |
| type | varchar (enum) | | O | 'ETC' | 창고 유형 |
| valid_record | boolean | | O | true | 활성 여부 |
| create_date | timestamp | | O | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | O | CURRENT_TIMESTAMP | 수정일 |

---

## 17. pallet

| 컬럼 | 타입 | PK | NOT NULL | UNIQUE | DEFAULT | 설명 |
|------|------|----|----------|--------|---------|------|
| id | int | O | O | | auto_increment | 팔레트 ID |
| code | varchar(50) | | O | O | | 팔레트 코드 |
| create_date | timestamp | | O | | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | O | | CURRENT_TIMESTAMP | 수정일 |

---

## 18. job_history

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | 이력 ID |
| warehouse_id | int | | warehouse.id | O | | 창고 ID |
| pallet_id | int | | pallet.id | | null | 팔레트 ID |
| sku_key | varchar(20) | | | | '' | 품목 키 |
| standard_type | varchar(100) | | | | '' | 품목명 |
| working_status | varchar(10) | | | O | 'COMPLETE' | 작업 상태 |
| st_count | int | | | O | -1 | 품목 수량 |
| loc_raw | varchar(20) | | | | '' | 위치 정보 |
| task_type | varchar(10) | | | O | 'NONE' | 작업 유형 (IN/OUT/MOVE/NONE) |
| batch_number | varchar(10) | | | | '' | 배치 번호 |
| order_number | varchar(20) | | | | '' | 오더 번호 |
| order_flow | varchar(10) | | | | '' | 오더 순서 |
| job_date | timestamp | | | O | CURRENT_TIMESTAMP | 작업 일자 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |

**FK**: `warehouse_id` → `warehouse.id`  
**FK**: `pallet_id` → `pallet.id` (nullable)

---

## 19. shipping_specification

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | ID |
| users_seq_id | int | | users.seq_id | | | 등록자 SEQ ID |
| standard_type | varchar(100) | | | O | '' | 출고 규격 |
| valid_record | boolean | | | O | true | 활성 여부 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | | O | CURRENT_TIMESTAMP | 수정일 |

**FK**: `users_seq_id` → `users.seq_id` (nullable)

---

## 20. noti

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | 공지사항 ID |
| users_seq_id | int | | users.seq_id | | | 작성자 SEQ ID |
| title | varchar(100) | | | O | '' | 제목 |
| content | text | | | O | '' | 내용 |
| valid_record | boolean | | | O | true | 활성 여부 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 작성일 |
| update_date | timestamp | | | O | CURRENT_TIMESTAMP | 수정일 |

**FK**: `users_seq_id` → `users.seq_id` (nullable)

---

## 21. todo

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | TODO ID |
| users_seq_id | int | | users.seq_id | | | 작성자 SEQ ID |
| standard_type | varchar(100) | | | | '' | 타이어 규격 |
| target_start_date | timestamp | | | O | CURRENT_TIMESTAMP | 목표 시작일 |
| target_end_date | timestamp | | | O | CURRENT_TIMESTAMP | 목표 종료일 |
| target_count | int | | | O | 0 | 목표량 |
| description | text | | | | '' | 내용 |
| alarm_offset_hours | int | | | O | 1 | 알람 발생 시간(시간) |
| alarm_process_flag | boolean | | | O | false | 알람 전송 여부 |
| valid_record | boolean | | | O | true | 활성 여부 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | | O | CURRENT_TIMESTAMP | 수정일 |

**FK**: `users_seq_id` → `users.seq_id` (nullable)

---

## 22. setting_system

| 컬럼 | 타입 | PK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----------|---------|------|
| id | int | O | O | auto_increment | ID |
| alarm_send_enabled | boolean | | O | true | 알람 전송 여부 |
| equipment_alarm_enabled | boolean | | O | true | 설비 알람 전송 여부 |
| inventory_alarm_enabled | boolean | | O | true | 재고 알람 전송 여부 |
| inventory_alarm_remaining_day | int | | O | -1 | 장기 재고 기준 일수 |
| load_warning_ratio_crane | int | | O | -1 | 크레인 경고 비율 (%) |
| load_danger_ratio_crane | int | | O | -1 | 크레인 위험 비율 (%) |
| load_warning_color_crane | varchar | | | '' | 크레인 경고 색상 |
| load_danger_color_crane | varchar | | | '' | 크레인 위험 색상 |
| load_warning_ratio_gantry | int | | O | -1 | 갠트리 경고 비율 (%) |
| load_danger_ratio_gantry | int | | O | -1 | 갠트리 위험 비율 (%) |
| load_warning_color_gantry | varchar | | | '' | 갠트리 경고 색상 |
| load_danger_color_gantry | varchar | | | '' | 갠트리 위험 색상 |
| refresh_browser | boolean | | O | false | 브라우저 새로고침 강제 |
| create_date | timestamp | | O | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | O | CURRENT_TIMESTAMP | 수정일 |

---

## 23. setting_remote

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | ID |
| seq_id | int | | users.seq_id | | | 사용자 SEQ ID |
| location | varchar(50) | | | | '' | 위치 |
| ip | varchar(20) | | | | '' | IP 주소 |
| port | int | | | O | 1 | 포트 번호 |
| valid_record | boolean | | | O | true | 활성 여부 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |
| update_date | timestamp | | | O | CURRENT_TIMESTAMP | 수정일 |

**FK**: `seq_id` → `users.seq_id` (ON DELETE CASCADE, nullable)

---

## 24. file

| 컬럼 | 타입 | PK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----------|---------|------|
| id | int | O | O | auto_increment | 파일 ID |
| name | text | | O | '' | 원본 파일명 |
| stored_name | text | | O | '' | 저장 파일명 |
| path | text | | O | '' | 저장 경로 |
| create_date | timestamp | | O | CURRENT_TIMESTAMP | 업로드일 |
| update_date | timestamp | | O | CURRENT_TIMESTAMP | 수정일 |

---

## 25. cell_view

| 컬럼 | 타입 | PK | FK | NOT NULL | UNIQUE | DEFAULT | 설명 |
|------|------|----|----|----------|--------|---------|------|
| id | int | O | | O | | auto_increment | ID |
| warehouse_id | int | | warehouse.id | O | | | 창고 ID |
| pallet_id | int | | pallet.id | | | null | 팔레트 ID |
| loc_all | varchar(50) | | | | O | | 전체 위치 (bay-bank-level) |
| loc_unit | varchar(50) | | | | | | 단위 위치 |
| loc_x | int | | | | | -1 | 위치 X (bay) |
| loc_y | int | | | | | -1 | 위치 Y (bank) |
| loc_z | int | | | | | -1 | 위치 Z (level) |
| cell_status | varchar(30) | | | O | | | 셀 상태 |
| enable | boolean | | | O | | true | 활성 여부 |
| sku_key | varchar(30) | | | | | null | 품목 키 |
| standard_type | varchar(100) | | | | | null | 품목명 |
| st_count | int | | | | | -1 | 수량 |
| luggage_flag | boolean | | | O | | false | 화물 여부 |
| batch_number | varchar(30) | | | | | null | 배치 번호 |
| order_number | varchar(30) | | | | | null | 오더 번호 |
| order_flow | varchar(10) | | | | | null | 오더 순서 |
| in_date | timestamp | | | | | CURRENT_TIMESTAMP | 입고일 |
| update_date | timestamp | | | | | CURRENT_TIMESTAMP | 수정일 |

**FK**: `warehouse_id` → `warehouse.id`  
**FK**: `pallet_id` → `pallet.id` (nullable)  
**인덱스**: `idx_cell_view_pallet` (pallet_id)

---

## 26. realtime_equipment_view

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | ID |
| equipment_id | int | | equipment.id | O | | 설비 ID (1:1) |
| status | varchar(20) | | | | '' | 설비 상태 |
| speed | int | | | | -1 | 속도 |
| loc_x | int | | | | 0 | 위치 X (bay) |
| loc_y | int | | | | 0 | 위치 Y (bank) |
| loc_z | int | | | | 0 | 위치 Z (level) |
| task_type | varchar(20) | | | | | 작업 유형 |
| standard_type | varchar(100) | | | | | 품목 규격 |
| st_count | int | | | | 0 | 품목 수량 |
| twin_status | varchar(20) | | | | 'DEFAULT' | 트윈 상태 |
| loaded | boolean | | | | false | 적재 여부 |
| action_type | varchar(30) | | | | 'NONE' | 액션 유형 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |

**FK**: `equipment_id` → `equipment.id` (1:1)

---

## 27. dock_view

| 컬럼 | 타입 | PK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----------|---------|------|
| id | int | O | O | auto_increment | ID |
| dock_no | int | | | -1 | 도크 번호 |
| gantry_code | int | | | -1 | 갠트리 코드 |
| status | varchar(30) | | | '' | 상태 |
| shipment_order | int | | | -1 | 출하 오더 |
| container_no | varchar(30) | | | '' | 컨테이너 번호 |
| unit_order_count | int | | | -1 | 단위 오더 수 |
| order_count | int | | | -1 | 오더 수 |
| outing_count | int | | | -1 | 출고 수 |
| in_gantry_count | int | | | -1 | 갠트리 투입 수 |
| conveyor_count | int | | | -1 | 컨베이어 수 |
| completion_count | int | | | -1 | 완료 수 |
| remand_count | int | | | -1 | 반송 수 |
| bad_count | int | | | -1 | 불량 수 |

---

## 28. item_master_view

| 컬럼 | 타입 | PK | NOT NULL | UNIQUE | 설명 |
|------|------|----|----------|--------|------|
| sku_key | varchar(20) | O | O | O | 품목 키 |
| standard_type | varchar(100) | | O | | 품목 규격명 |

---

## 29. alarm_queue

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | ID |
| alarm_id | int | | alarm.id | O | | 알람 ID |
| equipment_id | int | | equipment.id | O | | 설비 ID |
| process_status | int | | | O | 1 | 처리 상태 |
| create_date | timestamp | | | O | CURRENT_TIMESTAMP | 생성일 |

**FK**: `alarm_id` → `alarm.id` (ON DELETE CASCADE)  
**FK**: `equipment_id` → `equipment.id` (ON DELETE CASCADE)

---

## 30. job_queue

| 컬럼 | 타입 | PK | FK | NOT NULL | DEFAULT | 설명 |
|------|------|----|----|----------|---------|------|
| id | int | O | | O | auto_increment | ID |
| warehouse_id | int | | warehouse.id | O | | 창고 ID |
| pallet_id | int | | pallet.id | | | 팔레트 ID |
| sku_key | varchar(20) | | item_master_view.sku_key | | | 품목 키 |
| working_status | varchar(10) | | | | '' | 작업 상태 |
| st_count | int | | | | 0 | 품목 수량 |
| loc_raw | varchar(20) | | | | '' | 위치 정보 |
| task_type | varchar(10) | | | | '' | 작업 유형 |
| batch_number | varchar(10) | | | | '' | 배치 번호 |
| order_number | varchar(20) | | | | '' | 오더 번호 |
| order_flow | varchar(10) | | | | '' | 오더 순서 |
| job_date | timestamp | | | O | CURRENT_TIMESTAMP | 작업 일자 |

**FK**: `warehouse_id` → `warehouse.id`  
**FK**: `pallet_id` → `pallet.id`  
**FK**: `sku_key` → `item_master_view.sku_key` (nullable)

---

## ERD 관계도

```
users (1) ──< (N) role
users (1) ──< (N) login_history
users (1) ──< (N) refresh-token
users (1) ──< (N) alarm_user_relation         >── (N) alarm
users (1) ──< (N) alarm_history_process_by_user >── (N) alarm_history
users (1) ──< (N) message_dispatch_history
users (1) ──< (N) shipping_specification
users (1) ──< (N) noti
users (1) ──< (N) todo
users (1) ──< (N) setting_remote

equipment_type (1) ──< (N) equipment
equipment_type (1) ──< (N) alarm

warehouse (1) ──< (N) equipment
warehouse (1) ──< (N) job_history
warehouse (1) ──< (N) cell_view
warehouse (1) ──< (N) job_queue

pallet (1) ──< (N) job_history
pallet (1) ──< (N) cell_view
pallet (1) ──< (N) job_queue

equipment (1) ──  (1) realtime_equipment_view
equipment (1) ──< (N) equipment_operation_history
equipment (1) ──< (N) alarm_queue

alarm (1) ──< (N) alarm_queue
alarm (1) ──< (N) equipment_alarm_history

alarm_history (1) ──  (1) equipment_alarm_history
alarm_history (1) ──  (1) inventory_alarm_history
alarm_history (1) ──  (1) pallet_alarm_history
alarm_history (1) ──< (N) message_dispatch_history
alarm_history (1) ──< (N) alarm_history_process_by_user

item_master_view (1) ──< (N) job_queue
```
