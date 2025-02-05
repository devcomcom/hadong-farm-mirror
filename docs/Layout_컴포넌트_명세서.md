# Layout 컴포넌트 명세서

## 1. 기능 목적과 개요

### 1.1 목적

-   모든 페이지에서 일관된 레이아웃 제공
-   사용자 역할(농장주/근로자)에 따른 네비게이션 관리
-   반응형 디자인 지원

### 1.2 개요

-   Header, Navigation 컴포넌트를 포함한 기본 레이아웃 구성
-   사용자 역할 전환 기능 제공
-   모바일/데스크톱 환경 모두 지원

## 2. 상세 구현 요구사항

### 2.1 Header 컴포넌트

```typescript
interface HeaderProps {
    currentRole: "FARMER" | "WORKER";
    onRoleChange: (role: "FARMER" | "WORKER") => void;
    userName?: string;
    isLoggedIn: boolean;
}
```

-   shadcn/navigation-menu 활용
-   로고 및 서비스명 표시
-   사용자 역할 전환 (shadcn/dropdown-menu)
-   로그인/회원가입 버튼 (shadcn/button)

### 2.2 Navigation 컴포넌트

```typescript
interface NavigationProps {
    currentRole: "FARMER" | "WORKER";
    currentPath: string;
}
```

-   역할별 메뉴 구성
    -   농장주: 오세요 관리, 지원자 관리
    -   근로자: 갈게요 관리, 지원 현황
-   현재 페이지 하이라이트
-   모바일 반응형 메뉴

### 2.3 Layout 컴포넌트

```typescript
interface LayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showNav?: boolean;
    userRole?: "FARMER" | "WORKER";
}
```

### 2.4 Zustand 상태 관리

-   `zustand` 라이브러리를 사용하여 역할 상태를 전역적으로 관리
-   역할 변경 시 상태 업데이트 및 관련 컴포넌트 리렌더링 처리

```typescript
import create from "zustand";

interface RoleState {
    role: "FARMER" | "WORKER";
    setRole: (role: "FARMER" | "WORKER") => void;
}

const useRoleStore = create<RoleState>((set) => ({
    role: "FARMER", // 기본 역할 설정
    setRole: (role) => set({ role }),
}));
```

## 3. 컴포넌트 구조

### 3.1 기본 레이아웃

```tsx
// components/layout/Layout.tsx
import { useRoleStore } from "@/stores/roleStore";

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { role, setRole } = useRoleStore();

    return (
        <div className="min-h-screen">
            <Header currentRole={role} onRoleChange={setRole} />
            <Navigation currentRole={role} />
            <main className="container mx-auto px-4">{children}</main>
        </div>
    );
};
```

### 3.2 역할 전환 처리

```tsx
const RoleToggle: React.FC = () => {
    const { role, setRole } = useRoleStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">역할 전환</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRole("FARMER")}>
                    농장주
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole("WORKER")}>
                    근로자
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
```

## 4. 연관 기능들과의 관계

### 4.1 인증 시스템

-   Clerk 인증 상태에 따른 헤더 표시 변경
-   로그인/회원가입 페이지 연동

### 4.2 역할 관리

-   사용자 역할 상태 관리
-   역할별 페이지 접근 제어

### 4.3 라우팅

-   Next.js App Router와 통합
-   역할별 페이지 리다이렉션 처리

## 5. 제약사항 및 고려사항

### 5.1 성능

-   컴포넌트 메모이제이션
-   불필요한 리렌더링 방지

### 5.2 접근성

-   ARIA 레이블 적용
-   키보드 네비게이션 지원

### 5.3 반응형 디자인

-   모바일 우선 접근
-   브레이크포인트: sm(640px), md(768px), lg(1024px)

### 5.4 브라우저 지원

-   모던 브라우저 지원 (Chrome, Firefox, Safari, Edge)
-   IE 미지원
