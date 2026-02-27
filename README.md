# Simsasukgo v2

`PLAN.md` 기반 초기 세팅 저장소입니다.

## 구성
- `frontend`: Next.js(App Router) + TypeScript + Tailwind CSS
- `backend`: PostgreSQL 스키마/RLS 및 Edge Functions 스텁
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

## 환경 변수
- 프론트엔드: `frontend/.env.example` 참고
- 백엔드 함수: `backend/functions/.env.example` 참고

## 백엔드 실행 (선택)
- Supabase CLI 설치 후:
  - `cd backend`
  - `supabase start`
  - `supabase db reset`
  - `supabase functions serve --env-file functions/.env.example`
