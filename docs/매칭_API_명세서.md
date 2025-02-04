# 매칭 API 명세서

## 1. 기능 목적과 개요
### 1.1 목적
  - 구인/구직 매칭 프로세스 관리
  - 매칭 상태 추적
  - 작업 완료 처리

### 1.2 개요
  - RESTful API 제공
  - 실시간 상태 업데이트
  - 트랜잭션 관리

## 2. 상세 구현 요구사항
### 2.1 매칭 데이터
  ```typescript
  interface Match {
    id: string;
    jobPostingId: string;
    workerId: string;
    status: MatchStatus;
    message?: string;
    appliedAt: Date;
    updatedAt: Date;
    completedAt?: Date;
  }

  enum MatchStatus {
    PENDING = 'PENDING',    // 지원 대기
    ACCEPTED = 'ACCEPTED',  // 수락됨
    REJECTED = 'REJECTED',  // 거절됨
    CANCELED = 'CANCELED',  // 취소됨
    COMPLETED = 'COMPLETED' // 완료됨
  }
  ```

### 2.2 매칭 상태 관리
  ```typescript
  interface MatchStateManager {
    // 상태 변경 가능 여부 확인
    canTransitionTo: (
      currentStatus: MatchStatus,
      newStatus: MatchStatus
    ) => boolean;

    // 상태 변경 시 필요한 작업 처리
    handleStateTransition: (
      matchId: string,
      newStatus: MatchStatus
    ) => Promise<void>;
  }
  ```

## 3. API 엔드포인트
### 3.1 매칭 생성/관리
  ```typescript
  // 지원하기
  POST /api/matches
  {
    jobPostingId: string;
    message?: string;
  }

  // 지원 취소
  DELETE /api/matches/:matchId

  // 매칭 상태 변경 (수락/거절)
  PUT /api/matches/:matchId/status
  {
    status: MatchStatus;
    message?: string;
  }

  // 작업 완료 처리
  POST /api/matches/:matchId/complete
  {
    completedAt: string;  // ISO 8601
    feedback?: {
      rating: number;
      comment?: string;
    };
  }
  ```

### 3.2 매칭 조회
  ```typescript
  // 매칭 상세 조회
  GET /api/matches/:matchId
  Response: {
    match: Match;
    jobPosting: JobPosting;
    canCancel: boolean;
    canComplete: boolean;
  }

  // 매칭 목록 조회
  GET /api/matches
  Query Parameters: {
    status?: MatchStatus;
    role?: 'FARMER' | 'WORKER';
    page?: number;
    limit?: number;
  }
  Response: {
    items: Match[];
    total: number;
    hasMore: boolean;
  }
  ```

## 4. 이벤트 처리
### 4.1 매칭 이벤트
  ```typescript
  interface MatchEvent {
    type: 'MATCH_CREATED' | 'MATCH_UPDATED' | 'MATCH_COMPLETED';
    matchId: string;
    timestamp: string;
    data: {
      oldStatus?: MatchStatus;
      newStatus: MatchStatus;
      actorId: string;
    };
  }
  ```

### 4.2 알림 처리
  ```typescript
  interface MatchNotification {
    sendMatchNotification: (
      userId: string,
      type: 'APPLIED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED',
      matchData: {
        matchId: string;
        jobTitle: string;
        [key: string]: any;
      }
    ) => Promise<void>;
  }
  ```

## 5. 연관 기능들과의 관계
### 5.1 구인구직
  - 구인글 상태 연동
  - 매칭 가능 여부 확인

### 5.2 프로필
  - 작업 이력 관리
  - 평점 시스템

### 5.3 알림
  - 실시간 알림
  - 이메일 알림

## 6. 제약사항 및 고려사항
### 6.1 비즈니스 로직
  - 상태 변경 규칙
  - 매칭 제한 조건
  - 취소/거절 정책

### 6.2 성능
  - 동시성 제어
  - 트랜잭션 관리
  - 캐싱 전략

### 6.3 보안
  - 권한 검증
  - 데이터 접근 제어
  - API 요청 제한 