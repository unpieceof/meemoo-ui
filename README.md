# meemoo-ui

Telegram으로 저장한 메모를 Supabase에서 불러와 보여주는 개인용 메모 뷰어.
SvelteKit + Supabase + Tailwind CSS v4로 구성됩니다.

## 주요 기능

- 메모 목록 조회 (카테고리 / 태그 / 검색 필터)
- 메모 상세 페이지 (`/memo/[id]`) — summary 전체, 태그 전체, 원문 표시
- 제목 · 카테고리 · 태그 인라인 편집
- 메모 삭제

## 기술 스택

| 항목 | 버전 |
|---|---|
| Node.js | 20 LTS 이상 |
| SvelteKit | 2.x |
| Svelte | 5.x |
| Supabase JS | 2.x |
| Tailwind CSS | 4.x |
| adapter | adapter-node |

---

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 Supabase 프로젝트 정보를 입력합니다.

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

---

## Linux VM 배포

### 사전 요구사항

- Node.js 20 LTS 이상
- npm 10 이상

```bash
# Ubuntu/Debian 기준 Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1. 레포지토리 클론

```bash
git clone https://github.com/unpieceof/meemoo-ui.git
cd meemoo-ui
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
nano .env   # 또는 vim .env
```

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 프로덕션 빌드

```bash
npm run build
```

`build/` 디렉토리가 생성됩니다.

### 5. 서버 실행

```bash
node build
```

기본 포트는 `3000`입니다. 포트 변경이 필요하면:

```bash
PORT=8080 node build
```

### 6. systemd로 상시 실행 (선택)

`/etc/systemd/system/meemoo-ui.service` 파일 생성:

```ini
[Unit]
Description=meemoo-ui
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/meemoo-ui
ExecStart=/usr/bin/node build
Restart=on-failure
Environment=PORT=3000
EnvironmentFile=/home/ubuntu/meemoo-ui/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable meemoo-ui
sudo systemctl start meemoo-ui
sudo systemctl status meemoo-ui
```

---

## 환경 변수 목록

| 변수 | 필수 | 설명 |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| `PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon public key |
