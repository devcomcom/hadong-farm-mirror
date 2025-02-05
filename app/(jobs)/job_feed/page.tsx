"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

// 임포트할 컴포넌트 (구현되어 있다고 가정)
// import FilterSection from "@/components/jobs/FilterSection";
// import ViewToggle from "@/components/jobs/ViewToggle";
import JobCard from "@/components/jobs/job_card";
import LoadingCard from "@/components/jobs/loading_card";

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
        return {
            id,
            type: "FARMER", // 기본 구인 유형
            title: `Job ${id}`, // 구인 제목
            farmName: `Farm ${id}`, // 농장 이름
            location: { address: "Some Address", distance: 5 }, // 위치 정보
            workDate: { start: "2023-10-01", end: "2023-10-02" }, // 근무 기간
            payment: { amount: 120000, unit: "DAY" }, // 급여 정보
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

    // 다음 페이지 데이터를 불러오는 함수
    const fetchNextPage = async () => {
        const data = await fakeFetchJobs(page); // 데이터 fetching
        setItems((prev) => [...prev, ...data.items]); // 기존 목록에 새 데이터 추가
        setHasMore(data.hasMore); // 더 많은 데이터 여부 업데이트
        setPage((prev) => prev + 1); // 페이지 증가
    };

    useEffect(() => {
        fetchNextPage(); // 컴포넌트 마운트 시 데이터 fetching
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                {/* <FilterSection /> */}
                {/* <ViewToggle /> */}
            </div>
            <InfiniteScroll
                dataLength={items.length}
                next={fetchNextPage}
                hasMore={hasMore}
                loader={<LoadingCard />}
            >
                {items.map((job) => (
                    <JobCard
                        key={job.id} // 구인 아이디를 키로 사용
                        job={job} // JobCard에 구인 데이터 전달
                        onClick={() => router.push(`/jobs/${job.id}`)} // 클릭 시 구인 상세 페이지로 이동
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
}
