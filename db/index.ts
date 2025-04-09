// 필요한 모듈을 호출함
import { drizzle } from "drizzle-orm/postgres-js"; // drizzle ORM을 사용하여 PostgreSQL 데이터베이스와 연결
import dotenv from "dotenv"; // 환경 변수를 로드하기 위한 dotenv 모듈
import postgres from "postgres"; // PostgreSQL 클라이언트 모듈

// .env 파일에서 환경 변수를 로드
dotenv.config();

// 데이터베이스 URL을 사용하여 PostgreSQL 클라이언트를 생성
const client = postgres(process.env.DATABASE_URL as string);

// drizzle ORM을 사용하여 데이터베이스 인스턴스를 생성 처리
export const db = drizzle(client);
