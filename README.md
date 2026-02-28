# Simsasukgo v2

`PLAN.md` 기반 초기 세팅 저장소입니다.

## 구성

- `frontend`: Next.js(App Router) + TypeScript + Tailwind CSS
- `backend`: Nest.js + apps/libs + CQRS 구조
- `packages/shared`: Trip/Place/UserPreference/SyncLog 공용 타입

## 빠른 시작

1. Node.js LTS 설치
2. 의존성 설치
   - `npm install`
3. 프론트엔드 실행
   - `npm run dev:frontend`

## 변경 감시

- 백엔드 파일 변경 시 재시작 로그 출력
  - `npm run dev:backend`

## 프론트엔드 개발 지침

- Toss의 frontend-fundamentals 를 참고하여 개발하도록 한다.
- 아이콘 원본은 `frontend/resources/icons`에서 관리하고, `npm run sync:resources --workspace @simsasukgo/web`로 `frontend/public`에 동기화한다.

## 백엔드 개발 지침

- Nest.js 기반으로 개발하도록 한다.
- 백엔드 코드를 작성할 때에는 Nest.js 의 공식 가이드 문서의 내용을 철저히 따르도록 한다.
- 백엔드 구조는 `apps`(외부 인터페이스) + `libs`(CQRS/도메인/아웃바운드)로 유지한다.
- 데이터 CRUD 경로는 `Frontend -> Backend -> TypeORM -> PostgreSQL`로 유지하고, Supabase는 Auth 중심으로 사용한다.

## 의존성 아키텍처 규칙

- 프론트엔드/백엔드 공통으로 순환 참조를 금지한다.
- 계층 역참조를 금지한다.
  - `frontend/lib -> frontend/(app|components)` 금지
  - `frontend/components -> frontend/app` 금지
  - `backend/libs -> backend/apps` 금지
  - `backend/libs/domain -> backend/libs/(common|outbound|places|routes)` 금지
  - `backend/libs/common -> backend/libs/(outbound|places|routes)` 금지
- 아키텍처 규칙 검증:
  - `npm run deps:check`

## 환경 변수

- 프론트엔드: `frontend/.env.example` 참고
- 백엔드: `backend/.env.example` 참고
- 백엔드 `/places/*` 및 `/routes/*` API를 사용하려면 `GOOGLE_MAPS_API_KEY` 설정이 필요
- 모든 백엔드 API는 기본적으로 Bearer 토큰 인증이 필요하므로 `SUPABASE_URL`, `SUPABASE_ANON_KEY`가 필요
- `DB_MIGRATIONS_RUN_ON_BOOT`:
  - 미설정 시: 개발/테스트 환경에서 자동 실행, 운영 환경에서는 미실행
  - `true`: 부팅 시 TypeORM 마이그레이션 자동 실행
  - `false`: 부팅 시 자동 실행 안 함

## 백엔드 실행 (선택)

- API 서버 실행:
  - `npm run dev:backend`
- DB 스키마 적용(선택): TypeORM 마이그레이션 기반으로만 운영
  - `npm run migration:run`
  - `npm run migration:revert`
  - `npm run migration:show`
  - `npm run migration:create -- libs/outbound/rdb/src/migrations/InitSchema`
  - `npm run migration:generate -- libs/outbound/rdb/src/migrations/AddPlaces`
