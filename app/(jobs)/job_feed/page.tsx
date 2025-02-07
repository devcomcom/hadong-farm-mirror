"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

// 임포트할 컴포넌트
import FilterSection from "@/components/jobs/filter_section";
// import ViewToggle from "@/components/jobs/ViewToggle";
import JobCard from "@/components/jobs/job_card";
import LoadingCard from "@/components/jobs/loading_card";
import { DateRange } from "@/components/common/date_range_picker"; // DateRange 타입 임포트

// 구인 목록 아이템 인터페이스 (명세서 참고)
interface JobListItem {
    id: string; // 구인 아이디
    type: "FARMER" | "WORKER"; // 구인 유형
    title: string; // 구인 제목
    farmName?: string; // 농장 이름 (선택적)
    location: {
        address: string; // 위치 주소
        distance?: number; // 현재 위치 기준 거리 (선택적)
    };
    workDate: {
        start: string; // 근무 시작일
        end: string; // 근무 종료일
    };
    payment: {
        amount: number; // 급여 금액
        unit: "DAY" | "HOUR"; // 급여 단위 (일/시간)
    };
    status: "OPEN" | "CLOSED"; // 구인 상태 (모집중/마감)
    createdAt: string; // 작성일
}

// 더미 구인 데이터 fetching 함수 (실제 API 호출로 대체 가능)
async function fakeFetchJobs(page: number): Promise<{ items: JobListItem[]; hasMore: boolean }> {
    const dummyItems: JobListItem[] = Array.from({ length: 10 }).map((_, index) => {
        const id = ((page - 1) * 10 + index + 1).toString(); // 구인 아이디 생성

        const startDate = new Date(2025, 0, 1); // 2025년 1월 1일
        const endDate = new Date(2025, 2, 30); // 2025년 3월 30일
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        const formattedStartDate = randomDate.toISOString().split('T')[0]; // ISO 형식으로 변환 후 날짜 부분만 추출
        const formattedEndDate = new Date(randomDate.getTime() + 24 * 60 * 60 * 1000 * 7).toISOString().split('T')[0]; // 랜덤 날짜의 다음 날

        return {
            id,
            type: "FARMER", // 기본 구인 유형
            title: `Job ${id}`, // 구인 제목
            farmName: `Farm ${id}`, // 농장 이름
            location: { address: "Some Address", distance: 5 }, // 위치 정보
            workDate: { start: formattedStartDate, end: formattedEndDate }, // 근무 기간
            payment: { amount: Math.floor(Math.random() * (200000 - 120000 + 1)) + 120000, unit: "DAY" }, // 급여 정보
            status: "OPEN", // 구인 상태
            createdAt: new Date().toISOString(), // 작성일
        };
    });

    return new Promise((resolve) => {
        setTimeout(() => resolve({ items: dummyItems, hasMore: page < 5 }), 1000); // 더미 데이터 반환
    });
}

export default function JobFeedPage() {
    const router = useRouter(); // 라우터 훅 사용
    const [items, setItems] = useState<JobListItem[]>([]); // 구인 목록 상태
    const [page, setPage] = useState(1); // 현재 페이지 상태
    const [hasMore, setHasMore] = useState(true); // 더 많은 데이터 여부 상태
    const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null }); // 날짜 범위 상태 추가

    // 다음 페이지 데이터를 불러오는 함수 (에러 핸들링 추가)
    const fetchNextPage = async () => {
        try {
            const data = await fakeFetchJobs(page); // 데이터 fetching
            setItems((prev) => [...prev, ...data.items]); // 기존 목록에 새 데이터 추가
            setHasMore(data.hasMore); // 더 많은 데이터 여부 업데이트
            setPage((prev) => prev + 1); // 페이지 증가
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    useEffect(() => {
        fetchNextPage(); // 컴포넌트 마운트 시 데이터 fetching
    }, []);

    // 날짜 범위와 겹치는 아이템 필터링
    const filteredItems = items.filter((job) => {
        if (!dateRange.start || !dateRange.end) return true; // 날짜 범위가 설정되지 않은 경우 모든 아이템 표시
        const jobStart = new Date(job.workDate.start);
        const jobEnd = new Date(job.workDate.end);
        return (
            (jobStart <= dateRange.end && jobEnd >= dateRange.start) // 날짜 범위와 겹치는지 확인
        );
    });

    return (
        <div className="space-y-4 p-4">
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
                <FilterSection dateRange={dateRange} setDateRange={setDateRange} /> {/* 날짜 범위 상태 전달 */}
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => router.push("/jobs/new")}
                    aria-label="새 구인 글 작성"
                >
                    새 글 작성
                </button>
            </div>
            <InfiniteScroll
                dataLength={filteredItems.length}
                next={fetchNextPage}
                hasMore={hasMore}
                loader={<LoadingCard />}
                scrollThreshold={0.9}
                endMessage={
                    <p className="text-center py-4 text-gray-500">
                        더 이상 구인 글이 없습니다.
                    </p>
                }
            >
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((job, index) => (
                        <JobCard
                            key={`${job.id}-${index}`} // 구인 아이디를 키로 사용
                            job={job} // JobCard에 구인 데이터 전달
                            onClick={() => router.push(`/job_feed/${job.id}`)} // 클릭 시 구인 상세 페이지로 이동
                        />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}
