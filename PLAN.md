# 심사숙고(Simsasukgo) 기획 문서 작성 및 제품 스펙 고정 계획

## 요약
- 목적: 여행 중 등록한 장소/가게의 **영업 상태와 거리 기반 맥락**을 함께 보며, 일정 기간 내 **최적 이동 플랜**을 수립하는 서비스 정의.
- 산출물: `/Users/devholic/Desktop/Simsasukgo/PLAN.md` 신규 생성.
- 문서 수준: 사용자가 선택한 **기획 중심** 문서.
- 1차 타깃: **모바일 웹 PWA**.
- 핵심 연동: **Google Maps 기반 검색/지도/거리 계산/영업정보 동기화**.
- 현재 워크스페이스 상태: 파일 없음(완전 신규 작성 전제).

## PLAN.md 구성(결정 완료)
`PLAN.md`는 아래 목차와 내용으로 작성한다.

1. 서비스 개요
- 서비스명: 심사숙고
- 카테고리: 여행
- 핵심 주제: 정해진 일정 동안 최적의 이동 플랜 계획
- 기획 배경: 해외에서 Google Maps 사용 시 영업 상태 확인의 비효율(개별 클릭 필요) 해소
- 문제 정의/해결 가치:
  - 영업 중 여부 확인 시간을 단축
  - 방문 후보의 우선순위와 이동 동선을 동시에 관리

2. 핵심 사용자 시나리오
- 여행자가 가고 싶은 장소를 검색해 저장
- 현재 위치 기준 반경 레이어(100/200/300/500/1000m)로 근접 후보 파악
- 오픈 상태 동기화(자동 + 수동 버튼)
- 방문 체크 후 표시 정책(회색/숨김) 선택
- 일정 내 최적 경로 추천 확인

3. 기능 요구사항(핵심)
- 장소 등록:
  - Google Maps 검색 결과에서 음식점/장소/숙소로 분류 등록
  - 사용자 메모: 대표 메뉴, 특징 태그(예: 야키니쿠)
- 지도/위치:
  - 기본 지도 중심은 현재 위치
  - 실시간 추적 가능 시 자동 반영, 미지원/거부 시 `내 위치로 이동` 버튼으로 수동 갱신
  - 반경 원 토글: 100m, 200m, 300m, 500m, 1000m
- 방문 상태:
  - 방문 완료 체크 가능
  - 기본 정책: 설정에서 회색 표시/숨김 선택 가능
- 영업 상태:
  - 자동 동기화 + 수동 `오픈 여부 동기화` 버튼 제공
  - 상태: 영업 중/영업 종료/정보 없음
- 일정/플랜:
  - 사용자 여행 기간(시작~종료) 기준 후보 정렬
  - 1순위 최적화 기준: 이동시간 최소화
- 데이터 관리:
  - JSON 내보내기/가져오기
  - 통계 카드(총 마커, 카테고리별 수, 방문/미방문 수)
  - 전체 삭제 등 위험 작업 분리 UI

4. 정보 구조(IA) 및 화면 설계 재정의
- 탭 구조:
  - 지도 보기
  - 마커 관리
  - 설정
- 지도 보기:
  - 지도 + 반경 버튼 그룹 + 내 위치 이동 + 오픈 동기화
  - 방문 상태 시각 구분(컬러/회색/숨김)
- 마커 관리:
  - 검색 입력, 결과 리스트, 카테고리별 등록 버튼
  - 저장 항목 카드(거리/영업 상태/메모/방문 토글/삭제)
- 설정:
  - 통계, 백업/복원, 표시 정책, 동기화 주기, 위험 작업

5. UX 원칙(재설계 기준)
- 핵심 행동 3회 탭 이내:
  - 검색 후 등록
  - 현재 위치 갱신
  - 오픈 상태 동기화
- 지도 우선 정보 밀도:
  - 거리 + 영업 상태 + 방문 상태를 동시에 인지 가능하게
- 상태 일관성:
  - 동기화 시각(last synced at) 명시
  - API 실패 시 사용자 재시도 경로 명확화
- 모바일 우선:
  - 하단 고정 내비, 한 손 조작 우선 버튼 배치

6. 데이터 모델(기획 레벨)
- Trip
  - id, title, startDate, endDate, baseLocation(optional)
- Place
  - id, googlePlaceId, name, address, lat, lng
  - category(food/place/stay)
  - memoMenu, tags[]
  - distanceFromCurrent(optional)
  - openStatus(open/closed/unknown), openStatusUpdatedAt
  - visited(boolean), visitedAt(optional)
  - rating(optional)
- UserPreference
  - visitedDisplayMode(gray|hidden)
  - radiusPreset([100,200,300,500,1000] 중 활성값)
  - autoSyncEnabled, autoSyncIntervalMin
- SyncLog(optional 기획 항목)
  - syncedAt, successCount, failedCount, errorSummary

7. 외부 연동/인터페이스(공개 계약 수준)
- Google Maps Places 검색 인터페이스
  - 입력: query, location(optional), radius(optional)
  - 출력: placeId, name, address, location, rating, openingHoursSummary
- 영업 상태 동기화 인터페이스
  - 입력: 저장된 placeId 목록
  - 출력: placeId별 openStatus/openNow/nextCloseTime(optional)
- 경로 최적화 인터페이스(기획)
  - 입력: 현재위치, 후보 장소 목록, 시간창
  - 출력: 이동시간 최소화 기준 방문 순서
- JSON 백업 포맷 버전 필드 포함
  - schemaVersion, exportedAt, trip, places, preferences

8. 상태/예외 정책
- 위치 권한 거부:
  - 수동 위치 갱신 CTA 노출
- 영업정보 미제공 장소:
  - `정보 없음`으로 표기, 필터 제외 옵션 제공
- 네트워크 실패:
  - 마지막 동기화 시각 유지 + 재시도 버튼
- 중복 등록:
  - 동일 googlePlaceId 등록 시 기존 항목으로 포커스 이동

9. MVP 범위와 제외 범위
- MVP 포함:
  - 검색/등록, 지도 표시, 반경 토글, 방문 체크, 영업 동기화, 기본 일정 플랜 제안, 백업/복원
- MVP 제외:
  - 다중 사용자 협업
  - 소셜 공유
  - 고급 AI 개인화 추천
  - 오프라인 완전 동작 보장

10. 수용 기준(Acceptance Criteria)
- 사용자가 1개 이상 장소를 검색 후 카테고리 등록 가능
- 지도에서 현재 위치 기준 반경 원 전환 가능
- 방문 체크 후 회색/숨김 정책이 즉시 반영
- 오픈 상태 자동 동기화 + 수동 버튼 동작
- 일정 기간 내 추천 순서가 이동시간 최소화 기준으로 생성
- JSON 백업 후 복원 시 주요 데이터 무손실

11. 테스트 시나리오(기획 검증)
- 기능:
  - 장소 등록/수정/삭제
  - 카테고리 분류 정확성
  - 방문 상태 전환
- 지도:
  - 반경 전환 시 렌더 정확성
  - 현재 위치 갱신 실패/성공
- 동기화:
  - 정상 응답/부분 실패/전면 실패
  - 수동 동기화 연타 방지
- UX:
  - 초행 사용자 기준 주요 과업 완료 시간
  - 하단 탭 및 핵심 버튼 접근성
- 데이터:
  - 백업/복원 round-trip 검증
  - schemaVersion 호환성 경고

12. 단계별 실행 로드맵(문서 내 포함)
- Phase 1: 요구사항/화면 IA 확정
- Phase 2: 지도/검색/등록 핵심 플로우 구현
- Phase 3: 영업 동기화/방문 정책/반경 UX 완성
- Phase 4: 일정 최적화 + 백업/복원 + 안정화
- Phase 5: 베타 피드백 반영 및 정식 배포 준비

## 공용 API/인터페이스/타입 변경 사항(명시)
- 신규 정의(기획 단계):
  - `Place`, `Trip`, `UserPreference`, `SyncLog` 타입
  - `SearchPlaces`, `SyncOpenStatus`, `GetOptimizedRoute` 인터페이스
  - 백업 JSON 포맷 `schemaVersion` 필드 의무화
- 기존 시스템과 충돌 없음(현재 레포 비어 있음).

## 가정 및 기본값
- 플랫폼: 모바일 웹 PWA 고정.
- 문서 성격: 구현 코드가 아닌 기획 중심.
- 방문 표시 정책: 사용자 설정에서 `회색/숨김` 선택 가능(초기 기본값은 회색 권장으로 문서에 명시).
- 영업 동기화: 자동+수동 병행.
- 최적화 1순위: 이동시간 최소화.
- 지도/검색 데이터 원천: Google Maps 계열 API.

## 기술 스택 확정안(v1)
- Frontend: `Next.js(App Router) + TypeScript + Tailwind CSS`
- 이유:
  - 모바일 웹 PWA를 빠르게 구현하기 적합하며(App Router 기반 라우팅/레이아웃), 지도/마커관리/설정 탭 구조를 파일 시스템 라우팅으로 명확히 분리 가능.
  - TypeScript로 `Trip`, `Place`, `UserPreference`, `SyncLog` 타입 계약을 프론트/서버 전반에서 일관되게 유지 가능.
  - Tailwind CSS로 모바일 우선 UI(하단 고정 탭, 상태 배지, 카드형 리스트)를 빠르게 조합하고 디자인 시스템화하기 용이.
- Backend: `Supabase(PostgreSQL) + Edge Functions`
- 이유:
  - MVP에 필요한 DB, 인증, 스토리지, 함수 실행 환경을 통합 제공해 초기 인프라 구성 시간을 절감.
  - Edge Functions를 Google API 프록시로 사용해 클라이언트 API Key 노출 리스크를 줄이고 서버 측 검증/레이트 리밋 처리 가능.
  - PostgreSQL 기반으로 데이터 모델(Trip/Place/Preference/SyncLog)의 정합성과 스키마 진화를 관리하기 쉬움.
- 인증 전략: `Supabase Auth` (이메일/소셜 로그인은 단계적 도입)
- 이유:
  - 사용자별 여행 데이터(Trip/Place/Preference/SyncLog) 격리를 위해 인증 계층이 필수.
  - RLS(Row Level Security) 정책과 결합해 사용자 단위 접근 통제를 일관되게 적용 가능.
- 환경변수/API Key 관리 원칙:
  - Google API Key는 서버(Edge Functions) 전용 비밀값으로 보관하고 클라이언트 번들에 포함하지 않음.
  - 클라이언트에는 공개 가능한 키만 사용하며, Places/Routes 핵심 호출은 서버 프록시를 통해 실행.
  - 배포 환경별 `.env` 분리(로컬/스테이징/프로덕션) 및 키 로테이션 절차를 운영 정책에 포함.
- 이유:
  - API Key 노출, 무단 호출, 과금 리스크를 줄이고 호출량 제어(레이트 리밋/검증)를 서버에서 중앙 관리 가능.
  - 팀 협업 시 환경별 설정 혼선을 줄여 운영 안정성을 확보.
- 지도/검색/경로: `Google Maps JavaScript API + Places API + Routes API`
- 이유:
  - 서비스의 핵심 데이터 원천이 Google Maps 계열로 고정되어 기획 의도와 직접 일치.
  - Places API로 장소 검색/상세(주소, 평점, 영업 정보) 수집을 일관되게 처리 가능.
  - Routes API로 이동시간 기반 경로 계산을 우선 적용해, 커스텀 알고리즘 대비 현실 교통 반영 정확도를 높임.
- 자동 동기화 구조:
  - 본체: `pg_cron(Supabase Scheduler) + Edge Function`으로 주기 호출
  - 보조: 필요 시 `Supabase Realtime`으로 동기화 결과 UI 반영
  - 사용자 제어: `오픈 여부 동기화` 수동 버튼 병행
- 이유:
  - 자동 동기화의 본체를 스케줄러로 분리해 백그라운드 주기 실행을 안정적으로 보장.
  - Realtime은 동기화 결과 전파(상태 반영) 역할에 집중시켜 역할 혼동을 방지.
  - 수동 버튼을 병행해 네트워크 지연/실패 시 사용자 제어권과 신뢰도를 확보.
- SyncLog 저장 전략:
  - `sync_logs` 테이블(PostgreSQL)에 동기화 실행 이력(`syncedAt`, `successCount`, `failedCount`, `errorSummary`)을 저장.
  - 최근 이력 우선 조회(예: 최근 50건)와 보존 주기(예: 30~90일)는 운영 정책으로 관리.
- 이유:
  - 마지막 동기화 시각/실패 원인 추적을 서버 기준으로 보존해 디버깅 및 사용자 안내 정확도를 높임.
  - 클라이언트 메모리 의존을 피하고 기기 변경/새로고침 이후에도 일관된 이력 확인 가능.
- 거리 계산 전략:
  - MVP: `Haversine` 기반 거리 계산
  - 확장: 데이터 규모 증가 시 `PostGIS` 도입
- 이유:
  - MVP 단계의 데이터 규모(수십 개 장소 예상)에서는 Haversine으로 성능/정확도 균형이 충분.
  - 트래픽/데이터 증가 시 PostGIS로 반경 검색·공간 쿼리를 DB 레벨로 이전해 확장성 확보.
- 백업/복원 전략:
  - 앱 레벨 `JSON export/import` 사용
  - 백업 스키마: `schemaVersion`, `exportedAt`, `trip`, `places`, `preferences`
  - 비고: DBA 도구(`pg_dump`)와 분리하여 운영
- 이유:
  - 사용자 관점의 이식/복원 요구는 DB 전체 덤프가 아닌 앱 도메인 데이터 직렬화가 적합.
  - `schemaVersion`으로 버전 호환성 검증 및 마이그레이션 경고 처리를 명확히 정의 가능.
  - 운영/백업 책임(서비스 DB 관리)과 사용자 데이터 이동(앱 기능)을 분리해 장애 영향 범위를 축소.
