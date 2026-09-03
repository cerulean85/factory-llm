# TITAN System Architecture

> 스마트 물류창고 관제 시스템 (Smart Warehouse Monitoring & Control System)

---

## 1. 전체 시스템 개요

TITAN은 현장 설비(Gantry, Stacker Crane, RGV, Conveyor)에서 데이터를 수집하여 실시간 모니터링, 알람 처리, 물류 현황 관리를 제공하는 3-Tier 산업용 관제 플랫폼입니다.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TITAN System                                 │
│                                                                     │
│  ┌──────────────┐   gRPC    ┌──────────────┐  REST/SSE  ┌────────┐ │
│  │   Collector  │ ────────► │     WAS      │ ─────────► │  Web   │ │
│  │  (C# WPF)   │  Stream   │  (NestJS)    │            │(Next)  │ │
│  └──────────────┘           └──────────────┘            └────────┘ │
│         │                         │                                 │
│      OPC UA                  PostgreSQL                             │
│         │                    Redis                                  │
│         ▼                         │                                 │
│  [현장 설비 PLC]            SMS(Twilio)                              │
│  GTR / STC / RGV / CNV     Email(nodemailer)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. 컴포넌트별 상세

### 2.1 titan_collector — 현장 데이터 수집기
| 항목 | 내용 |
|------|------|
| **언어/프레임워크** | C# / .NET 6 / WPF |
| **플랫폼** | Windows Desktop App |
| **프로토콜** | OPC UA Client (HES.LIB 라이브러리) |
| **역할** | gRPC 서버 역할 (WAS가 구독) |
| **연결 대상** | 현장 PLC: `172.22.51.138:5519` |

**핵심 클래스 구조:**
```
App (Application)
└── MainView (Window)
    └── OPCUAClient
        └── OpcuaHelper (HES.LIB, external)
            └── DeviceInterfaceFactory (factory)
```

**동작 흐름:**
1. 앱 시작 시 OPC UA 서버(PLC)에 자동 연결
2. 설비 상태 변경, 알람 발생 등 이벤트를 구독(Subscribe)
3. gRPC 서버로서 WAS의 `OPCUASubscribe` 스트림 요청에 응답
4. `OccurredAlarmMessage`, `ChangedTraceMessage` 등의 이벤트를 스트리밍

---

### 2.2 titan_was — 백엔드 애플리케이션 서버
| 항목 | 내용 |
|------|------|
| **언어/프레임워크** | TypeScript / NestJS 11 |
| **런타임** | Node.js |
| **포트** | 3300 |
| **DB** | PostgreSQL (TypeORM 0.3) |
| **캐시** | Redis |
| **인증** | JWT (Access Token + Refresh Token) |
| **컨테이너** | Docker / docker-compose |

#### 모듈 구성도

```
titan_was/src/
├── core/                          # 핵심 인프라
│   ├── grpc/
│   │   ├── foundation/            # gRPC 클라이언트 코어 (연결·재연결·스트림)
│   │   └── collector/             # Collector 전용 gRPC 구독 서비스
│   │       └── proto/             # grpc-core.proto (OPCUASubscribe 등)
│   ├── sse/                       # Server-Sent Events (실시간 Push → Web)
│   ├── mail/                      # 이메일 발송 (nodemailer)
│   ├── sms/                       # SMS 발송 (Twilio)
│   └── backup/postgres/           # PostgreSQL 자동 백업
│
├── collector-interface/           # Collector ↔ WAS 인터페이스 계층
│   ├── queue/
│   │   ├── alarm-queue/           # 알람 큐 (1초 폴링 → 알람이력 변환)
│   │   └── job-queue/             # 작업 큐
│   └── view/
│       ├── realtime-equipment-view/  # 설비 실시간 상태 뷰
│       ├── cell-view/             # 창고 셀 상태 뷰
│       └── dock-view/             # 도크 상태 뷰
│
├── domains/                       # 비즈니스 도메인
│   ├── users/                     # 사용자 관리 (users, role, login-history)
│   ├── equipment/                 # 설비 관리 (equipment, equipment-type, operation-history)
│   ├── alarm/                     # 알람 시스템
│   │   ├── alarm/                 # 알람 정의 마스터
│   │   ├── alarm-history/         # 알람 발생 이력
│   │   ├── alarm-user-relation/   # 알람 담당자 매핑
│   │   └── alarm-message-dispatch/# 알람 메시지 발송 이력
│   ├── storage/                   # 물류·재고
│   │   ├── warehouse/             # 창고 마스터
│   │   ├── pallet/                # 팔레트
│   │   ├── job-history/           # 작업 수행 이력
│   │   └── shipping-specification/# 출하 사양
│   ├── noti/                      # 알림 (Notification)
│   ├── todo/                      # Todo 관리
│   ├── composites/dash-board/     # 대시보드 (복합 조회)
│   └── setting/
│       ├── remote/                # 원격 제어 설정
│       └── system/                # 시스템 설정
│
├── common/                        # 공통 유틸 (미들웨어, 인터셉터, enum)
├── config/                        # 환경 설정 (DB, gRPC, JWT, debug flags)
└── seeds/                         # 초기 데이터 시더
```

#### 핵심 데이터 흐름 — 알람 처리 파이프라인

```
[Collector PLC Event]
       │ OPC UA
       ▼
[titan_collector] ──gRPC stream──► [GrpcCollectorService]
                   OPCUASubscribe        │
                                   processAlarmEvent()
                                         │
                                         ▼
                                  [alarm_queue 테이블]  ← DB 버퍼
                                         │
                                  (1초 간격 폴링)
                                         │
                                   [AlarmQueueService]
                                    /           \
                   process_status=1             process_status=0
                   (알람 발생)                  (알람 완료)
                        │                           │
                   INSERT alarm_history        UPDATE alarm_history
                   DELETE alarm_queue          DELETE alarm_queue
                        │
                    ┌───┴───────────────┐
                    ▼                   ▼
              [SSE Push]          [SMS 발송]
           → Web 실시간          → 담당자 핸드폰
             이벤트 알림          (Twilio)
```

---

### 2.3 titan_web — 프론트엔드 웹 클라이언트
| 항목 | 내용 |
|------|------|
| **언어/프레임워크** | TypeScript / Next.js 15 / React 19 |
| **상태관리** | Redux Toolkit + Zustand |
| **스타일** | TailwindCSS 4 |
| **차트** | ECharts 5 + D3.js 7 |
| **3D 렌더링** | Three.js + @react-three/fiber |
| **국제화** | next-intl (다국어) |
| **컨테이너** | Docker / docker-compose |

#### 페이지 구조 (App Router - `[locale]` 기반)

```
app/[locale]/
├── login/               # 로그인
├── signup/              # 회원가입
├── find-acc/            # 계정 찾기
│
├── ops/                 # 운영 (Operations)
│   ├── alm-stat/        # 알람 통계 (ECharts 차트)
│   ├── alm-hist/        # 알람 발생 이력
│   ├── log-basic/       # 기본 로그
│   ├── log-ship/        # 출하 로그
│   ├── log-equip/       # 설비 로그
│   ├── eq-hist/         # 설비 이력
│   ├── eq-oper/         # 설비 운전 현황
│   ├── stat-fact/       # 공장 통계
│   ├── stat-fwh/        # 창고 통계
│   └── report/          # 리포트
│
├── adm/                 # 관리 (Administration)
│   ├── user-list/       # 사용자 관리
│   ├── alm-code/        # 알람 코드 관리
│   ├── alm-setting/     # 알람 설정
│   ├── alm-adhist/      # 알람 처리 이력
│   ├── noti-list/       # 알림 목록
│   ├── login-hist/      # 로그인 이력
│   └── oth-setting/     # 기타 설정
│
├── modeling/            # 3D 창고 모델링 (Three.js)
└── remote/              # 원격 제어
```

#### 레이어 구조 (titan_web)
```
pages (app/)
  └── services/          # API 호출 서비스 레이어 (AlarmService, EquipService ...)
      └── repositories/  # HTTP 요청 래퍼 (reqGet, reqPost, reqPatch ...)
          └── NEXT_PUBLIC_API_URL (→ titan_was:3300)
```

**인증:** JWT Bearer Token (localStorage) + Refresh Token 자동 갱신

---

## 3. 통신 프로토콜 맵

```
┌──────────────────────────────────────────────────────────────────────┐
│  현장 PLC        Collector      WAS (3300)       Web Client          │
│  (OPC UA)       (gRPC Svr)    (gRPC Cli)       (Next.js)           │
│                                                                      │
│  ──OPC UA──►  ──────────────────────────────────────────────        │
│  subscribe       OPCUASubscribe (gRPC Streaming)                    │
│  ChangedTrace  ◄──gRPC stream──────────────────                     │
│  AlarmEvent    ──────────────────────────────────────────────       │
│                                                                      │
│                               ──REST API (HTTP/JSON)──►             │
│                               Bearer JWT                             │
│                               ◄──JSON Response──────────            │
│                                                                      │
│                               ──SSE (실시간 Push)──────►            │
│                               event: ALARM_TRIGGER                   │
│                               data: [alarmHistoryIds]                │
│                                                                      │
│  ──OPC UA──►  ──────DB Queue──►  alarm_queue 테이블                 │
│              (Collector 직접 DB 쓰기 가능성)                          │
└──────────────────────────────────────────────────────────────────────┘
```

| 구간 | 프로토콜 | 방향 |
|------|----------|------|
| PLC → Collector | OPC UA | 단방향 구독 |
| Collector → WAS | gRPC (streaming) | 양방향 스트림 |
| WAS → DB | PostgreSQL (TCP) | 읽기/쓰기 |
| WAS → Redis | Redis Protocol | 캐시 |
| WAS → Web | REST API (HTTP/JSON) | 요청/응답 |
| WAS → Web | SSE | 서버 Push (단방향) |
| WAS → 담당자 | SMS (Twilio), Email | 단방향 |

---

## 4. 데이터베이스 스키마 (주요 테이블)

```
users ──FK──► role
  │
  └──FK──► alarm_user_relation ──FK──► alarm
                                          │
                                    alarm_history ──FK──► equipment
                                          │
                                  equipment_alarm_history
                                          │
                                    alarm_queue (버퍼)

warehouse ──1:N──► equipment
         ──1:N──► cell_view ──FK──► pallet
         ──1:N──► job_history ──FK──► pallet

equipment ──1:N──► equipment_operation_history
          ──1:N──► realtime_equipment_view (뷰 테이블)
```

### 주요 테이블 역할
| 테이블 | 역할 |
|--------|------|
| `users` | 사용자 계정 (user_id, password, role) |
| `equipment` | 설비 마스터 (GTR, STC, RGV, CNV) |
| `alarm` | 알람 코드 정의 (code, level, description) |
| `alarm_queue` | 알람 수신 버퍼 (process_status: 1=발생, 0=완료) |
| `alarm_history` | 알람 발생/처리 이력 |
| `warehouse` | 창고 마스터 (GANTRY_STOCK, CRANE_STOCK 등) |
| `cell_view` | 창고 셀 상태 (3D 좌표, 팔레트, 재고) |
| `pallet` | 팔레트 정보 (RFID 태그, 상태) |
| `job_history` | 입출고/이동 작업 이력 |
| `realtime_equipment_view` | 설비 실시간 상태 (DB View) |

---

## 5. 설비 타입

| 코드 | 명칭 | 설명 |
|------|------|------|
| GTR | Gantry | 갠트리 크레인 (G01, G02 ...) |
| STC | Stacker Crane | 스태커 크레인 (S01, S02 ...) |
| RGV | Rail Guided Vehicle | 레일 무인 운반차 |
| CNV | Conveyor | 컨베이어 |

---

## 6. 배포 구성 (Docker)

```
titan_was/docker-compose.yml
  └── titan-was (NestJS)
        ├── PORT: 3300
        ├── DB: 172.22.51.222:5432/titan
        └── DEBUG_* flags (개발/운영 전환)

titan_web/docker-compose.yml
  └── titan-web (Next.js)
        └── NEXT_PUBLIC_API_URL: titan-was:3300
```

---

## 7. 주요 설계 패턴

| 패턴 | 적용 위치 |
|------|----------|
| **Queue Buffer Pattern** | alarm_queue 테이블로 Collector→WAS 비동기 버퍼링 |
| **Polling → SSE Push** | 1초 DB 폴링 후 SSE로 Web 푸시 |
| **Repository Pattern** | TypeORM Entity 별 Repository 분리 |
| **Module Federation** | NestJS 모듈 단위 도메인 격리 |
| **JWT + Refresh Token** | 무상태 인증 + 자동 갱신 |
| **gRPC Streaming** | 설비 실시간 이벤트 수신 (지수 백오프 재연결) |
| **Event Emitter** | RGV 알람 등 내부 도메인 이벤트 분리 |
| **Seeder** | 서버 기동 시 기본 데이터 자동 삽입 |
