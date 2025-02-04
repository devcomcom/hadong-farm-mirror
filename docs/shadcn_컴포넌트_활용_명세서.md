# shadcn 컴포넌트 활용 명세서

## 1. 기능 목적과 개요
### 1.1 목적
  - 일관된 UI/UX 제공
  - 재사용 가능한 컴포넌트 구성
  - 접근성과 사용성 향상

### 1.2 개요
  - shadcn/ui 컴포넌트 설정 및 커스터마이징
  - 테마 시스템 구성
  - 공통 컴포넌트 래퍼 구현

## 2. 상세 구현 요구사항
### 2.1 초기 설치 및 설정
  ```bash
  # 1. shadcn-ui 초기 설치
  npx shadcn@latest init

### 2.2 필수 컴포넌트 설치
  ```bash
  # 기본 UI 컴포넌트
  npx shadcn@latest add button input form card

  # 대화상자 관련 컴포넌트
  npx shadcn@latest add dialog dropdown-menu

  # 네비게이션 관련 컴포넌트
  npx shadcn@latest add tabs navigation-menu

  # 선택/날짜 관련 컴포넌트
  npx shadcn@latest add select calendar

  # 알림 관련 컴포넌트
  npx shadcn@latest add toast
  ```

### 2.3 컴포넌트 래퍼
  ```typescript
  // components/ui/button-wrapper.tsx
  interface ButtonWrapperProps extends ButtonProps {
    loading?: boolean;
    loadingText?: string;
  }

  // components/ui/form-wrapper.tsx
  interface FormWrapperProps extends FormProps {
    onSubmit: (data: any) => Promise<void>;
    submitText: string;
  }
  ```

## 3. 컴포넌트 커스터마이징
### 3.1 테마 설정
  ```typescript
  // lib/themes.ts
  export const themeConfig = {
    colors: {
      primary: {...},
      secondary: {...},
      accent: {...}
    },
    fonts: {...},
    spacing: {...}
  }
  ```

### 3.2 컴포넌트 변형
  ```typescript
  // 버튼 변형
  const buttonVariants = {
    primary: "bg-primary text-white...",
    secondary: "bg-secondary text-gray-800...",
    outline: "border-2 border-primary..."
  }

  // 카드 변형
  const cardVariants = {
    default: "bg-white shadow-md...",
    highlight: "bg-primary/5 border-primary..."
  }
  ```

## 4. 사용 예시
### 4.1 기본 사용법
  ```tsx
  // 폼 예시
  <Form onSubmit={handleSubmit}>
    <Input name="email" type="email" label="이메일" />
    <Button type="submit">저장</Button>
  </Form>

  // 대화상자 예시
  <Dialog>
    <DialogTrigger asChild>
      <Button>열기</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>제목</DialogHeader>
      <div>내용</div>
    </DialogContent>
  </Dialog>
  ```

### 4.2 커스텀 훅
  ```typescript
  // hooks/useToast.ts
  export const useToast = () => {
    const { toast } = useToast();
    
    return {
      success: (message: string) => toast({ description: message }),
      error: (message: string) => toast({ variant: "destructive", description: message })
    };
  };
  ```

## 5. 연관 기능들과의 관계
### 5.1 레이아웃 시스템
  - Layout 컴포넌트와의 통합
  - 반응형 디자인 지원

### 5.2 폼 처리
  - React Hook Form 통합
  - Zod 유효성 검증

### 5.3 상태 관리
  - 컴포넌트 상태 관리
  - 전역 상태와의 연동

## 6. 제약사항 및 고려사항
### 6.1 성능
  - 번들 크기 최적화
  - 동적 임포트 활용

### 6.2 접근성
  - ARIA 속성 유지
  - 키보드 인터랙션 보장

### 6.3 유지보수성
  - 일관된 네이밍 규칙
  - 문서화 및 스토리북 구성

### 6.4 브라우저 지원
  - 모던 브라우저 지원
  - 폴리필 전략 