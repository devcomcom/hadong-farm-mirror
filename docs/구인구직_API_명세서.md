# 구인구직 API 명세서

## 1. 기능 목적과 개요
### 1.1 목적
  - 구인/구직 정보 관리
  - 효율적인 검색 및 필터링
  - 데이터 일관성 유지

### 1.2 개요
  - CRUD API 제공
  - 검색/필터링 API
  - 상태 관리 API

## 2. 상세 구현 요구사항
### 2.1 구인구직 데이터
  ```typescript
  interface JobPosting {
    id: string;
    type: 'FARMER' | 'WORKER';  // 오세요/갈게요
    userId: string;
    farmId?: string;
    title: string;
    description: string;
    workDate: {
      start: Date;
      end: Date;
    };
    payment: {
      amount: number;
      unit: 'DAY' | 'HOUR';
    };
    status: 'OPEN' | 'CLOSED' | 'COMPLETED';
    createdAt: Date;
    updatedAt: Date;
  }
  ```

### 2.2 검색 필터
  ```typescript
  interface JobSearchFilter {
    type?: 'FARMER' | 'WORKER';
    location?: {
      latitude: number;
      longitude: number;
      radius: number;  // km
    };
    dateRange?: {
      start: Date;
      end: Date;
    };
    status?: 'OPEN' | 'CLOSED' | 'COMPLETED';
  }
  ```

## 3. API 엔드포인트
### 3.1 구인구직 글 관리
  ```typescript
  // 글 작성
  POST /api/jobs
  {
    type: 'FARMER' | 'WORKER';
    farmId?: string;
    title: string;
    description: string;
    workDate: {
      start: Date;
      end: Date;
    };
    payment: {
      amount: number;
      unit: 'DAY' | 'HOUR';
    };
  }

  // 글 수정
  PUT /api/jobs/:jobId
  {
    title?: string;
    description?: string;
    workDate?: {
      start: Date;
      end: Date;
    };
    payment?: {
      amount: number;
      unit: 'DAY' | 'HOUR';
    };
  }

  // 글 삭제
  DELETE /api/jobs/:jobId
  ```

### 3.2 검색 및 필터링
  ```typescript
  // 검색
  GET /api/jobs/search
  {
    query?: string;
    filter?: JobSearchFilter;
    page?: number;
    limit?: number;
  }

  // 응답
  {
    items: JobPosting[];
    total: number;
    page: number;
    hasMore: boolean;
  }
  ```

## 4. 미들웨어
### 4.1 검증 미들웨어
  ```typescript
  interface JobValidationMiddleware {
    validateJobData: (data: Partial<JobPosting>) => Promise<boolean>;
    checkFarmOwnership: (farmId: string) => Promise<boolean>;
  }
  ```

### 4.2 필터링 미들웨어
  ```typescript
  interface JobFilterMiddleware {
    parseSearchParams: (query: any) => JobSearchFilter;
    validateDateRange: (range: any) => boolean;
  }
  ```

## 5. 연관 기능들과의 관계
### 5.1 농장 정보
  - 농장 데이터 연동
  - 위치 정보 활용

### 5.2 매칭 시스템
  - 구인구직 상태 관리
  - 매칭 정보 연동

### 5.3 알림
  - 새 글 알림
  - 상태 변경 알림

## 6. 제약사항 및 고려사항
### 6.1 성능
  - 검색 최적화
  - 캐싱 전략
  - 페이지네이션

### 6.2 데이터 정합성
  - 트랜잭션 관리
  - 동시성 제어
  - 상태 관리

### 6.3 확장성
  - 필터 확장 가능성
  - API 버전 관리
  - 데이터 마이그레이션 