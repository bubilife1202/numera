# 누메라(Numera): 잃어버린 논리의 세계

![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

**수학은 억지로 삼키는 약이 아니라, 세상을 건설하는 도구다.**

## 🎮 프로젝트 개요

누메라는 수학 교육을 게임화한 웹 기반 학습 플랫폼입니다. 초등학교 3학년부터 중학교 2학년 학생들을 대상으로, 수학 공포(Math Phobia)를 호기심으로 전환하고 추상적인 수학 개념을 시각적/경험적 직관으로 체화시킵니다.

### 핵심 가치
- **재미(Fun)**: 게임처럼 즐기는 수학
- **성취(Mastery)**: 단계별 성장과 보상
- **연결(Connection)**: 수학과 실생활의 연결

### 타겟
초등학교 3학년 ~ 중학교 2학년 (추상적 사고가 시작되는 시기, 수학 포기자가 발생하는 '골든 타임')

## 🏗️ 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **3D Engine**: Three.js + React Three Fiber
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend (서버리스)
- **Database**: Supabase (무료 티어) 또는 LocalStorage/IndexedDB
- **Authentication**: Supabase Auth
- **Deployment**: Netlify (무료 호스팅)

### DevOps
- **CI/CD**: GitHub Actions
- **Version Control**: Git

## 🚀 시작하기

### 필수 요구사항
- Node.js 20.x 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/numera.git
cd numera

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 환경 변수 설정 (선택사항)

Supabase를 사용하는 경우, `.env` 파일을 생성하세요:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 프로젝트 구조

```
numera/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── public/
│   ├── assets/
│   │   ├── models/        # 3D 모델 (GLB/GLTF)
│   │   ├── textures/      # 텍스처
│   │   ├── sounds/        # 사운드 이펙트
│   │   └── images/        # 2D 이미지
│   └── data/
│       ├── curriculum.json    # 학년별 커리큘럼
│       ├── questions.json     # 문제 은행
│       └── dialogues.json     # NPC 대화
├── src/
│   ├── components/
│   │   ├── game/          # 게임 컴포넌트
│   │   ├── ui/            # UI 컴포넌트
│   │   └── common/        # 공통 컴포넌트
│   ├── systems/           # 게임 시스템
│   │   ├── combat/        # 전투 (연산)
│   │   ├── building/      # 건축 (도형)
│   │   ├── progression/   # 진행도 관리
│   │   └── adaptive/      # 적응형 난이도
│   ├── services/          # 서비스 레이어
│   ├── hooks/             # React Hooks
│   ├── stores/            # Zustand 스토어
│   ├── utils/             # 유틸리티
│   ├── types/             # TypeScript 타입
│   └── App.tsx
├── netlify.toml           # Netlify 설정
├── vite.config.ts
└── package.json
```

## 🎯 Phase 1 MVP 목표

### Milestone 1: 프로젝트 셋업 ✅
- [x] Vite + React + TypeScript 초기화
- [x] 필수 라이브러리 설치
- [x] 프로젝트 구조 생성
- [x] Netlify 배포 설정
- [x] GitHub Actions CI/CD

### Milestone 2: 코어 게임 엔진 (진행 중)
- [ ] Three.js 기본 씬 구축
- [ ] 플레이어 캐릭터 구현
- [ ] 수학 문제 시스템 (수와 연산)
- [ ] UI/HUD 구현
- [ ] 진행도 저장 시스템

### Milestone 3: 게임화 메카니즘
- [ ] 첫 번째 퀘스트 체인: "부서진 다리"
- [ ] 적응형 난이도 시스템
- [ ] 보상 시스템
- [ ] 튜토리얼 시스템

### Milestone 4: 폴리싱 & 베타 준비
- [ ] 성능 최적화
- [ ] 반응형 디자인
- [ ] 접근성 개선
- [ ] 베타 테스터 피드백 시스템

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #6366f1 (인디고 - 수학/로직)
- **Secondary**: #8b5cf6 (보라 - 판타지)
- **Success**: #10b981 (초록 - 정답)
- **Error**: #ef4444 (빨강 - 오답)
- **Warning**: #f59e0b (주황 - 힌트)
- **Background**: #0f172a (다크 블루)
- **Surface**: #1e293b (슬레이트)

### 타이포그래피
- **게임 UI**: Orbitron
- **본문**: Noto Sans KR

## 📊 학습 원리

### 비고츠키의 근접 발달 영역(ZPD)
AI가 아이의 현재 수준을 진단하여, 혼자서는 풀기 어렵지만 힌트가 있으면 해결 가능한 '최적의 난이도'를 실시간으로 제공합니다.

### 나선형 교육과정
같은 개념이 게임 진행에 따라 점진적으로 심화되어 반복 등장합니다.

## 🤝 기여하기

누메라는 교육의 미래를 만들어가는 프로젝트입니다. 기여를 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 팀

- **CEO & Product Vision**: 30년 경력 교육 전문가
- **CTO & Technical Lead**: 풀스택 개발자
- **Game Designer**: 게임화 전문가
- **UX/UI Designer**: 사용자 경험 디자이너

## 📧 연락처

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**"수학 공부해"라고 말하지 않습니다. "이 문을 열려면 암호를 풀어야 해"라고 말합니다.**
