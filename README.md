# VALOVOTE

## Cloudflare Pages

- Build command: `npm run build:pages`
- Build output directory: `out`
- Root directory: `/`

팬 투표로 VALORANT 무기 스킨, 요원, 스프레이, 총기 장식, 프로 선수를 랭킹화하는 반응형 웹사이트입니다.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- Supabase Auth, PostgreSQL, Row Level Security
- Valorant-API

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다. Supabase 환경변수가 없을 때는 Valorant-API의 실제 정적 데이터를 읽는 읽기 전용 미리보기로 동작합니다. 로그인과 투표는 Supabase 설정 후 활성화됩니다.

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- `NEXT_PUBLIC_*` 값만 브라우저에 노출됩니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 `npm run seed`, `npm run sync:valorant`에서만 사용합니다.
- service role 키를 배포 플랫폼의 public 환경변수나 클라이언트 코드에 넣지 마세요.

## Supabase database

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 [`supabase/schema.sql`](./supabase/schema.sql)을 실행합니다.
3. `.env.local`에 Project URL, anon key, service role key를 입력합니다.
4. 기본 카테고리와 선수 데이터를 넣습니다.
5. Valorant-API 데이터를 동기화합니다.

```bash
npm run seed
npm run sync:valorant
```

동기화 스크립트는 `category_id, external_id` 고유 키로 upsert하므로 반복 실행해도 같은 항목이 중복 생성되지 않습니다.

프로 선수 데이터는 [`seed/pro-players.json`](./seed/pro-players.json)에서 관리합니다. 로스터는 자주 바뀌므로 운영 배포 전에 팀과 이미지 URL을 최신 정보로 검토하세요.

## Google OAuth

1. Google Cloud Console에서 OAuth 2.0 Client ID를 생성합니다.
2. Google OAuth의 Authorized redirect URI에 아래 Supabase callback URL을 추가합니다.

```text
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

3. Supabase Dashboard의 **Authentication > Providers > Google**에서 Google provider를 활성화하고 Client ID/Secret을 입력합니다.
4. **Authentication > URL Configuration**에서 Site URL을 설정합니다.

```text
http://localhost:3000
```

5. Redirect URLs에 로컬과 실제 배포 주소를 추가합니다.

```text
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
```

로그인 성공 시 `handle_new_user` DB trigger가 `profiles` 행을 생성합니다. 세션은 Supabase SSR cookie와 `src/proxy.ts`를 통해 갱신됩니다.

## Voting security

- `votes`에는 `(user_id, item_id)` unique 제약이 있습니다.
- insert/delete는 `auth.uid() = user_id`인 경우만 RLS가 허용합니다.
- vote insert 시 선택한 `category_id`가 실제 item의 category와 같은지도 검사합니다.
- update policy는 제공하지 않아 기존 vote 수정은 차단됩니다.
- categories, items, vote counts는 공개 조회만 허용됩니다.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run seed
npm run sync:valorant
```

## Routes

- `/`
- `/rankings`
- `/rankings/skins`
- `/rankings/agents`
- `/rankings/sprays`
- `/rankings/flex`
- `/rankings/players`
- `/item/[id]`
- `/profile`
- `/settings`

## Data and legal notice

Game assets are loaded from [Valorant-API](https://valorant-api.com/). VALOVOTE is an unofficial fan-made site and is not endorsed by Riot Games. VALORANT and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
