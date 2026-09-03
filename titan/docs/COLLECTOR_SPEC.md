# TITAN Collector 기능정의서

| 항목 | 내용 |
|------|------|
| 문서명 | TITAN Collector 기능정의서 |
| 버전 | v0.1 |
| 작성일 | 2026-04-15 |
| 프로젝트 | TITAN Collector |
| 플랫폼 | Windows Desktop (WPF / .NET 6.0) |

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [시스템 아키텍처](#2-시스템-아키텍처)
3. [기능 목록](#3-기능-목록)
4. [기능 상세 정의](#4-기능-상세-정의)
   - 4.1 OPC UA 클라이언트 연결
   - 4.2 연결 상태 모니터링
   - 4.3 연결 해제
5. [화면 정의](#5-화면-정의)
6. [클래스 구조](#6-클래스-구조)
7. [외부 연동](#7-외부-연동)
8. [비기능 요구사항](#8-비기능-요구사항)
9. [미구현 및 향후 과제](#9-미구현-및-향후-과제)

---

## 1. 프로젝트 개요

### 1.1 목적

TITAN Collector는 산업 현장의 설비·센서 데이터를 **OPC UA 프로토콜**을 통해 실시간으로 수집하는 Windows 데스크톱 애플리케이션입니다.

### 1.2 배경 및 도메인

- 스마트 팩토리 / 산업 IoT (IIoT) 환경에서 가동 중인 설비와 OPC UA 서버를 통해 통신
- 운영자가 설비 상태를 실시간으로 파악하고 데이터를 수집·관리할 수 있는 수집 클라이언트 역할 수행

### 1.3 기술 스택

| 구분 | 내용 |
|------|------|
| 언어 | C# |
| 프레임워크 | .NET 6.0 (Windows) |
| UI | WPF (Windows Presentation Foundation) |
| 통신 프로토콜 | OPC UA |
| 주요 라이브러리 | HES.LIB.Communication.OPCUA v1.2.0 |
| 로깅 | log4net v3.0.3 (추가됨, 미사용) |

### 1.4 시스템 역할

```
[TITAN Collector (클라이언트)]  <──OPC UA──>  [산업 설비 / OPC UA 서버]
```

---

## 2. 시스템 아키텍처

### 2.1 레이어 구조

```
┌───────────────────────────────────┐
│           View Layer              │
│  MainView.xaml / MainView.xaml.cs │
│  - UI 렌더링                       │
│  - 사용자 이벤트 처리               │
└────────────────┬──────────────────┘
                 │ 생성 / 호출
┌────────────────▼──────────────────┐
│       Communication Layer         │
│       OPCUAClient.cs              │
│  - 연결 / 해제 추상화               │
│  - 비동기 연결 처리                 │
└────────────────┬──────────────────┘
                 │ 래핑
┌────────────────▼──────────────────┐
│    External Library Layer         │
│    HES.LIB.Communication.OPCUA    │
│  - OpcuaHelper                    │
│  - DeviceInterfaceFactory         │
│  - EquipmentInterfaceType         │
└───────────────────────────────────┘
```

### 2.2 클래스 관계 요약

| 관계 | 설명 |
|------|------|
| `App` extends `Application` | WPF 애플리케이션 진입점 |
| `MainView` extends `Window` | 메인 윈도우 |
| `MainView` → `OPCUAClient` | Composition (MainView가 OPCUAClient를 생성·소유) |
| `OPCUAClient` → `OpcuaHelper` | Composition (통신 로직 래핑) |
| `OPCUAClient` → `DeviceInterfaceFactory` | Dependency (인터페이스 초기화 사용) |

---

## 3. 기능 목록

| ID | 기능명 | 구분 | 구현 상태 |
|----|--------|------|----------|
| F-01 | OPC UA 서버 연결 | 통신 | 완료 |
| F-02 | OPC UA 서버 연결 해제 | 통신 | 완료 |
| F-03 | 연결 상태 실시간 표시 | UI | 완료 |
| F-04 | 비동기 연결 처리 | 통신 | 완료 |
| F-05 | 연결 오류 처리 및 표시 | 통신/UI | 완료 |
| F-06 | 수집 데이터 표시 | UI | **미구현** |
| F-07 | 설정 정보 관리 (DB/설정파일) | 설정 | **미구현** |
| F-08 | 로깅 시스템 | 공통 | **미구현** |
| F-09 | 다중 서버 연결 관리 | 통신 | **미구현** |

---

## 4. 기능 상세 정의

---

### F-01. OPC UA 서버 연결

| 항목 | 내용 |
|------|------|
| 기능 ID | F-01 |
| 기능명 | OPC UA 서버 연결 |
| 담당 클래스 | `OPCUAClient`, `MainView` |
| 트리거 | 애플리케이션 시작 시 `InitOPCUAClient()` 자동 호출 |
| 입력 | IP 주소 (현재 하드코딩: `172.22.51.138`), 포트 (현재 하드코딩: `5519`) |
| 처리 흐름 | 아래 참조 |
| 출력 | 연결 성공 여부 (`bool`) |
| 예외 처리 | try-catch로 예외 포착 후 UI에 에러 상태 표시 |

**처리 흐름**

```
MainView.InitOPCUAClient()
  1. OPCUAClient 인스턴스 생성 (IP, Port 전달)
       └─> OpcuaHelper.SetIPAddress(IP, Port) 호출
       └─> DeviceInterfaceFactory.GetInstance(EquipmentInterfaceType.Opcua) 호출
  2. OPCUAClient.Connect() 비동기 호출
       └─> ExcuteService() 내에서
           └─> DeviceInterfaceFactory.InitialInterface() 실행 (별도 Thread)
           └─> 결과 Task<bool>로 반환
  3. 연결 결과에 따라 UI 상태 업데이트
```

**상태 전이**

```
[초기] ──시작──> [Connecting...] ──성공──> [Connected]
                                └─실패──> [Connection Failed]
```

---

### F-02. OPC UA 서버 연결 해제

| 항목 | 내용 |
|------|------|
| 기능 ID | F-02 |
| 기능명 | OPC UA 서버 연결 해제 |
| 담당 클래스 | `OPCUAClient` |
| 트리거 | 수동 호출 (`DisConnect()`) |
| 처리 흐름 | `ExcuteService()` 내에서 연결 해제 로직 실행 |
| 출력 | 성공 여부 (`bool`) |
| 예외 처리 | try-catch 내 에러 로깅 (현재 Console.WriteLine) |

---

### F-03. 연결 상태 실시간 표시

| 항목 | 내용 |
|------|------|
| 기능 ID | F-03 |
| 기능명 | 연결 상태 실시간 표시 |
| 담당 클래스 | `MainView` |
| 구현 방식 | `Dispatcher.Invoke()`를 사용한 스레드 안전 UI 업데이트 |

**상태별 UI 표시**

| 상태 | 표시 텍스트 | 색상 |
|------|------------|------|
| 연결 중 | `Connecting...` | 주황색 (`Brushes.Orange`) |
| 연결 성공 | `Connected` | 녹색 (`Brushes.Green`) |
| 연결 실패 | `Connection Failed` | 빨간색 (`Brushes.Red`) |

---

### F-04. 비동기 연결 처리

| 항목 | 내용 |
|------|------|
| 기능 ID | F-04 |
| 기능명 | 비동기 연결 처리 |
| 담당 클래스 | `OPCUAClient`, `MainView` |
| 목적 | UI 스레드 블로킹 방지 |
| 구현 방식 | `async/await` + `Task.Run()` 패턴 |

**비동기 처리 구조**

```csharp
// MainView
public async void InitOPCUAClient() {
    UpdateOPCUAStatus("Connecting...", Orange);
    bool result = await _opcuaClient.Connect();
    UpdateOPCUAStatus(result ? "Connected" : "Connection Failed", ...);
}

// OPCUAClient
public async Task<bool> Connect() {
    return await Task.Run(() => ExcuteService(...));
}
```

---

### F-05. 연결 오류 처리 및 표시

| 항목 | 내용 |
|------|------|
| 기능 ID | F-05 |
| 기능명 | 연결 오류 처리 및 표시 |
| 담당 클래스 | `OPCUAClient`, `MainView` |
| 처리 방식 | try-catch 블록에서 예외 포착 후 `false` 반환 |
| UI 반영 | `Connection Failed` (빨간색) 상태로 표시 |
| 에러 출력 | `Console.WriteLine(ex.Message)` (로그 파일 미연동) |

---

## 5. 화면 정의

### 5.1 MainView (메인 윈도우)

**화면 구성 요소**

| 요소 | 타입 | 설명 |
|------|------|------|
| OPC UA 상태 텍스트 | TextBlock | 연결 상태 문자열 표시 |
| 상태 색상 | Foreground/Background | 연결 상태에 따른 색상 변경 |

**화면 상태 흐름**

```
[앱 시작]
    │
    ▼
[상태: Connecting... / 주황색]
    │
    ├── 연결 성공 ──> [상태: Connected / 녹색]
    │
    └── 연결 실패 ──> [상태: Connection Failed / 빨간색]
```

---

## 6. 클래스 구조

### 6.1 OPCUAClient

**위치**: `TITAN_Collector/Communication/OPCUAClient.cs`

| 멤버 | 타입 | 접근자 | 설명 |
|------|------|--------|------|
| `_opcuaHelper` | `OpcuaHelper` | private | OPC UA 통신 래퍼 인스턴스 |
| `OPCUAClient(string, string)` | 생성자 | public | IP, Port를 받아 초기화 |
| `Connect()` | `Task<bool>` | public async | OPC UA 서버 비동기 연결 |
| `DisConnect()` | `bool` | public | OPC UA 서버 연결 해제 |
| `ExcuteService(Func<bool>, string)` | `bool` | private | 서비스 실행 공통 래퍼 (try-catch 포함) |

### 6.2 MainView

**위치**: `TITAN_Collector/View/MainView.xaml.cs`

| 멤버 | 타입 | 접근자 | 설명 |
|------|------|--------|------|
| `_opcuaClient` | `OPCUAClient` | private | OPC UA 클라이언트 인스턴스 |
| `InitOPCUAClient()` | `async void` | public | OPC UA 클라이언트 초기화 및 연결 시작 |
| `UpdateOPCUAStatus(string, Brush)` | `void` | private | UI 상태 표시 업데이트 (Dispatcher 사용) |

### 6.3 App

**위치**: `TITAN_Collector/App.xaml.cs`

| 멤버 | 타입 | 설명 |
|------|------|------|
| `App` | class | WPF Application 진입점, 현재 별도 로직 없음 |

---

## 7. 외부 연동

### 7.1 OPC UA 서버

| 항목 | 내용 |
|------|------|
| 프로토콜 | OPC UA |
| 서버 IP | `172.22.51.138` (현재 하드코딩) |
| 서버 포트 | `5519` (현재 하드코딩) |
| 통신 방향 | 단방향 (Collector → OPC UA 서버, 데이터 읽기) |
| 라이브러리 | `HES.LIB.Communication.OPCUA v1.2.0` |

### 7.2 라이브러리 의존성

| 패키지 | 버전 | 용도 | 사용 여부 |
|--------|------|------|----------|
| `HES.LIB.Communication.OPCUA` | 1.2.0 | OPC UA 통신 | 사용 중 |
| `log4net` | 3.0.3 | 로그 기록 | 미사용 (추가만 됨) |

---

## 8. 비기능 요구사항

### 8.1 성능

| 항목 | 기준 |
|------|------|
| 연결 비동기 처리 | UI 블로킹 없이 연결 처리 |
| 스레드 안전성 | Dispatcher.Invoke를 통한 UI 스레드 안전 업데이트 |

### 8.2 안정성

| 항목 | 기준 |
|------|------|
| 예외 처리 | 모든 통신 메서드는 try-catch로 예외 처리 |
| 연결 실패 복구 | 연결 실패 시 UI에 상태 표시 (자동 재연결 미구현) |

### 8.3 운영 환경

| 항목 | 내용 |
|------|------|
| OS | Windows (net6.0-windows) |
| 실행 형태 | WinExe (단독 실행 파일) |
| Null 안전성 | C# Nullable 활성화 (`<Nullable>enable</Nullable>`) |

---

## 9. 미구현 및 향후 과제

### 9.1 즉시 수정 필요 사항

| 항목 | 현황 | 권장 조치 |
|------|------|----------|
| IP/Port 하드코딩 | `172.22.51.138:5519` 소스 내 고정 | DB 또는 App.config로 외부화 |
| 에러 메시지 포맷 오류 | `{ex.Message}` 문자열 보간 오류 가능성 | `$"{ex.Message}"` 또는 `string.Format` 확인 |
| 로그 미연동 | log4net 패키지 추가되었으나 미사용 | 로그 설정 및 핸들러 연결 |

### 9.2 향후 개발 항목

| 우선순위 | 항목 | 설명 |
|---------|------|------|
| High | 수집 데이터 표시 | OPC UA 서버로부터 수신한 데이터를 화면에 표시 |
| High | 설정 외부화 | IP/Port를 DB 또는 설정 파일로 분리 관리 |
| Medium | 로깅 시스템 구축 | log4net을 활용한 로그 파일 기록 |
| Medium | 자동 재연결 | 연결 끊김 시 자동 재연결 로직 |
| Medium | 다중 서버 연결 | 복수의 OPC UA 서버 동시 연결 지원 |
| Low | 테스트 코드 작성 | 단위 테스트 및 통합 테스트 추가 |
| Low | 수집 데이터 저장 | DB 또는 파일로 수집 데이터 저장 |

---

*본 문서는 2026-04-15 기준 코드베이스를 분석하여 작성되었습니다.*
