-- 유저 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(10) CHECK (role IN ('FARMER', 'WORKER', 'INACTIVITY')) NOT NULL
);

-- 농장 테이블
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    address VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 구인 게시물 테이블
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    farm_id INT REFERENCES farms(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    work_date JSONB NOT NULL, -- { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" }
    payment JSONB NOT NULL, -- { "amount": NUMERIC, "unit": "DAY" | "HOUR" }
    location JSONB NOT NULL, -- { "address": "string", "latitude": NUMERIC, "longitude": NUMERIC }
    status VARCHAR(10) CHECK (status IN ('OPEN', 'CLOSED', 'COMPLETED')) NOT NULL,
    quota INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 매칭 테이블
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    job_posting_id INT REFERENCES job_postings(id) ON DELETE CASCADE,
    farmer_id INT REFERENCES users(id) ON DELETE CASCADE,
    worker_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(10) CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'WAITLIST')) NOT NULL,
    worker_score INT,
    worker_comment TEXT,
    farmer_score INT,
    farmer_comment TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);