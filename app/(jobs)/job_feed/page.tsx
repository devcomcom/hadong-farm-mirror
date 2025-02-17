"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "@/components/common/button";

// 임포트할 컴포넌트
import FilterSection from "@/components/jobs/filter_section";
import JobCard from "@/components/jobs/job_card";
import LoadingCard from "@/components/jobs/loading_card";
import MapView from "./_components/map_view"; // 지도 뷰 컴포넌트 임포트
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

// API 호출 함수
const fetchJobPostings = async () => {
    const response = await fetch('/api/get_post_list');
    if (!response.ok) {
        throw new Error('Failed to fetch job postings');
    }
    const data = await response.json();
    return data.jobPostings;
};

export default function JobFeedPage() {
    const router = useRouter(); // 라우터 훅 사용
    const [items, setItems] = useState<JobListItem[]>([]); // 구인 목록 상태
    const [hasMore, setHasMore] = useState(true); // 더 많은 데이터 여부 상태
    const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null }); // 날짜 범위 상태 추가
    const [viewMode, setViewMode] = useState<"list" | "map">("list"); // 뷰 모드 상태 추가

    // 다음 페이지 데이터를 불러오는 함수 (에러 핸들링 추가)
    const fetchNextPage = async () => {
        try {
            const data = await fetchJobPostings(); // 데이터 fetching
            setItems((prev) => [...prev, ...data]); // 기존 목록에 새 데이터 추가
            setHasMore(data.length > 0); // 더 많은 데이터 여부 업데이트
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
                <Button
                    color="blue"
                    onClick={() => router.push("/new")}
                >
                    새 글 작성
                </Button>
                <div className="flex space-x-2">
                    <Button
                        color="grey"
                        viewMode={viewMode === "list" ? "active" : "default"}
                        onClick={() => setViewMode("list")}
                    >
                        목록 보기
                    </Button>
                    <Button
                        color="grey"
                        viewMode={viewMode === "map" ? "active" : "default"}
                        onClick={() => setViewMode("map")}
                    >
                        지도 보기
                    </Button>
                </div>
            </div>
            <div>
                {viewMode === 'list' ? ( // 상태값에 따라 목록 뷰 출력
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
                ) : (
                    <MapView items={filteredItems} /> // 지도 뷰 출력
                )}
            </div>
        </div>
    );
}