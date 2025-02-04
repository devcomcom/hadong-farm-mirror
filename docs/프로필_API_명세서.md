# 프로필 API 명세서

## 1. 기능 목적과 개요
### 1.1 목적
  - 사용자 프로필 정보 관리
  - 활동 이력 추적
  - 역할별 정보 제공

### 1.2 개요
  - RESTful API 제공
  - 역할 기반 데이터 관리
  - 이미지 업로드 지원

## 2. 상세 구현 요구사항
### 2.1 프로필 데이터
  ```typescript
  interface UserProfile {
    id: string;
    email: string;
    name: string;
    contact: string;
    profileImage?: string;
    roles: ('FARMER' | 'WORKER')[];
    activeRole: 'FARMER' | 'WORKER';
    createdAt: Date;
    updatedAt: Date;
  }

  interface FarmerProfile extends UserProfile {
    farms: Array<{
      id: string;
      name: string;
      address: string;
      description?: string;
      jobCount: number;
      rating?: number;
    }>;
    stats: {
      totalJobs: number;
      activeJobs: number;
      completedJobs: number;
      averageRating?: number;
    };
  }

  interface WorkerProfile extends UserProfile {
    preferredLocations?: Array<{
      address: string;
      latitude: number;
      longitude: number;
      radius: number;  // km
    }>;
    workHistory: Array<{
      jobId: string;
      farmName: string;
      period: {
        start: Date;
        end: Date;
      };
      status: 'COMPLETED' | 'ONGOING';
      rating?: number;
    }>;
    stats: {
      totalWork: number;
      completedWork: number;
      averageRating?: number;
    };
  }
  ```

## 3. API 엔드포인트
### 3.1 프로필 관리
  ```typescript
  // 프로필 조회
  GET /api/profile
  Response: {
    profile: FarmerProfile | WorkerProfile;
  }

  // 프로필 수정
  PUT /api/profile
  Request: {
    name?: string;
    contact?: string;
    profileImage?: File;
    activeRole?: 'FARMER' | 'WORKER';
    preferredLocations?: Array<{
      address: string;
      latitude: number;
      longitude: number;
      radius: number;
    }>;
  }

  // 프로필 이미지 업로드
  POST /api/profile/image
  Request: FormData {
    image: File;
  }
  Response: {
    imageUrl: string;
  }
  ```

### 3.2 활동 이력
  ```typescript
  // 작업 이력 조회
  GET /api/profile/history
  Query Parameters: {
    type?: 'ALL' | 'COMPLETED' | 'ONGOING';
    page?: number;
    limit?: number;
  }
  Response: {
    items: Array<{
      id: string;
      type: 'JOB' | 'MATCH';
      title: string;
      date: string;
      status: string;
      details: any;
    }>;
    total: number;
    hasMore: boolean;
  }

  // 평점 및 후기
  GET /api/profile/reviews
  Response: {
    reviews: Array<{
      id: string;
      rating: number;
      comment?: string;
      reviewer: {
        id: string;
        name: string;
      };
      jobId: string;
      createdAt: string;
    }>;
    stats: {
      averageRating: number;
      totalReviews: number;
    };
  }
  ```

## 4. 미들웨어
### 4.1 이미지 처리
  ```typescript
  interface ImageProcessor {
    // 이미지 리사이징
    resize: (
      file: File,
      options: {
        width: number;
        height: number;
        quality: number;
      }
    ) => Promise<File>;

    // 이미지 최적화
    optimize: (
      file: File,
      maxSizeKB: number
    ) => Promise<File>;
  }
  ```

## 5. 연관 기능들과의 관계
### 5.1 인증
  - 사용자 정보 연동
  - 권한 관리

### 5.2 매칭
  - 작업 이력 연동
  - 평점 시스템

### 5.3 농장 관리
  - 농장 정보 연동
  - 작업 통계

## 6. 제약사항 및 고려사항
### 6.1 데이터 관리
  - 프로필 정보 검증
  - 이미지 용량 제한
  - 데이터 정합성

### 6.2 성능
  - 이미지 최적화
  - 캐싱 전략
  - API 응답 시간

### 6.3 보안
  - 개인정보 보호
  - 파일 업로드 보안
  - 접근 권한 관리 