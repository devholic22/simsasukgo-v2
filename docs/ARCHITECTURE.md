# Architecture

## Monorepo Layout

- `frontend`: Next.js App Router + TypeScript + Tailwind (모바일 웹 PWA)
- `backend`: Nest.js + CQRS + TypeORM
- `packages/shared`: 프론트/백 공통 계약 타입(응답 envelope, 에러 코드, 메시지 코드, 도메인 타입)

## Frontend

- Path: `frontend`
- Responsibilities:
  - UI 렌더링 및 사용자 인터랙션 처리
  - `@simsasukgo/shared` 계약 기반 API 응답 파싱
  - Supabase Auth 연동(클라이언트 공개 키 범위)
- Notes:
  - `frontend/resources/pwa/sw.js`를 `frontend/public/sw.js`로 동기화하여 service worker를 등록
  - 홈 화면은 model hook + presentation component 분리 구조로 관리
  - 아이콘 소스는 `frontend/resources/icons`에서 관리하고, 빌드/실행 전에 `frontend/public`으로 동기화한다.

## Backend

- Path: `backend`
- Framework:
  - Nest.js (`apps/api`)
  - CQRS (`@nestjs/cqrs`)
  - TypeORM (`libs/outbound/rdb`)
- Entry:
  - `apps/api/src/main.ts`
  - 글로벌 `GlobalHttpExceptionFilter`, `ResponseEnvelopeInterceptor` 적용
- Module Structure:
  - `apps/api`: 외부 인터페이스 계층(Controller)
  - `libs/outbound/google`: Google Places/Routes 연동 모듈
  - `libs/outbound/rdb`: `RdbModule`(TypeORM 연결/엔티티 등록/DB repository provider)
  - `libs/places`, `libs/routes`: CQRS use-case 계층(Command/Query + Handler)
  - `libs/common`: 공통 가드/필터/인터셉터/에러
  - `libs/domain`: 엔티티 및 도메인 규칙

## API Surface (Current)

- `GET /base-data` (인증 필요)
- `POST /base-data/initialize` (인증 필요)
- `POST /places/search` (인증 필요)
- `POST /places/open-status/sync` (인증 필요)
- `POST /routes/optimize` (인증 필요)

모든 응답은 `@simsasukgo/shared`의 envelope 계약을 따른다.

- success: `{ success: true, data, timestamp }`
- error: `{ success: false, statusCode, path, error, timestamp }`

## Error Policy

- 요청 유효성 실패는 `createValidationException`을 사용한다.
  - Source: `backend/libs/common/src/errors/validation.exception.ts`
  - HTTP status: `400 Bad Request`
  - error contract: `error.code=COMMON_VALIDATION`, `error.source=backend`
- 구현되지 않은 신규 use-case가 생기면 `NotImplementedError`를 사용한다.
  - Source: `backend/libs/common/src/errors/not-implemented.error.ts`
  - HTTP status: `501 Not Implemented`
  - error contract: `error.code=COMMON_NOT_IMPLEMENTED`, `error.source=backend`
- 예외 직렬화는 `GlobalHttpExceptionFilter`가 담당한다.

## Data Layer

- TypeORM config: `backend/libs/outbound/rdb/src/config`
- Nest RDB module: `backend/libs/outbound/rdb/src/rdb.module.ts`
- Repository providers:
  - `TripRdbRepository`
  - `UserPreferenceRdbRepository`
- Migration registry: `backend/libs/outbound/rdb/src/config/typeorm.migrations.ts`
- Migration:
  - TypeORM migration: `backend/libs/outbound/rdb/src/migrations`
  - 부팅 자동 실행: `DB_MIGRATIONS_RUN_ON_BOOT` 환경변수(`typeorm.config.ts`)
- Root scripts:
  - `npm run migration:run`
  - `npm run migration:revert`
  - `npm run migration:show`

## Security Baseline

- 인증/인가: 글로벌 `AuthGuard` 적용
  - API 요청은 Supabase `/auth/v1/user` 검증으로 Bearer 토큰 유효성을 확인
  - `@Public()`은 헬스체크 등 특수 엔드포인트에서만 제한적으로 사용
- API 키: 백엔드(outbound)에서만 사용, 프론트에 비밀키 노출 금지
- 프론트/백 계약 불일치 방지: `packages/shared` 단일 소스 기준
