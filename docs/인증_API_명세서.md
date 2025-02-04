# 인증 API 명세서

## 1. 기능 목적과 개요
### 1.1 목적
  - 사용자 인증 및 권한 관리
  - 역할 기반 접근 제어
  - 보안성 확보

### 1.2 개요
  - Clerk 인증 시스템 연동
  - 역할 관리 API
  - 토큰 기반 인증

## 2. 상세 구현 요구사항
### 2.1 사용자 데이터
  ```typescript
  interface User {
    id: string;
    email: string;
    name: string;
    roles: ('FARMER' | 'WORKER')[];
    contact: string;
    createdAt: Date;
    updatedAt: Date;
  }
  ```

### 2.2 역할 데이터
  ```typescript
  interface UserRole {
    userId: string;
    role: 'FARMER' | 'WORKER';
    isActive: boolean;
    updatedAt: Date;
  }
  ```

## 3. API 엔드포인트
### 3.1 회원가입
  ```typescript
  // 회원가입 요청
  POST /api/auth/signup
  {
    email: string;
    password: string;
    name: string;
    contact: string;
    roles: ('FARMER' | 'WORKER')[];
  }

  // 응답
  {
    success: boolean;
    user?: User;
    error?: string;
  }
  ```

### 3.2 로그인
  ```typescript
  // 로그인 요청
  POST /api/auth/login
  {
    email: string;
    password: string;
  }

  // 응답
  {
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
  }
  ```

### 3.3 역할 관리
  ```typescript
  // 역할 추가
  POST /api/auth/roles
  {
    role: 'FARMER' | 'WORKER';
  }

  // 역할 전환
  PUT /api/auth/roles/active
  {
    role: 'FARMER' | 'WORKER';
  }
  ```

## 4. 미들웨어
### 4.1 인증 미들웨어
  ```typescript
  interface AuthMiddleware {
    validateToken: (token: string) => Promise<User>;
    checkRole: (role: string) => Promise<boolean>;
  }
  ```

### 4.2 권한 미들웨어
  ```typescript
  interface RoleMiddleware {
    requireRole: (role: string) => Promise<void>;
    validateRoleChange: (newRole: string) => Promise<boolean>;
  }
  ```

## 5. 연관 기능들과의 관계
### 5.1 프로필 관리
  - 사용자 정보 연동
  - 역할별 프로필 관리

### 5.2 구인구직
  - 역할 기반 접근 제어
  - 권한 검증

### 5.3 매칭
  - 사용자 인증 상태 확인
  - 역할별 기능 제한

## 6. 제약사항 및 고려사항
### 6.1 보안
  - HTTPS 필수
  - JWT 토큰 관리
  - CSRF 방지

### 6.2 성능
  - 토큰 캐싱
  - 데이터베이스 인덱싱
  - 요청 제한

### 6.3 확장성
  - 소셜 로그인 지원
  - 역할 확장 가능성
  - API 버전 관리 