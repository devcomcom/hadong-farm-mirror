"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import JobCard from "@/components/jobs/worker_card";
import LoadingCard from "@/components/jobs/loading_card";

// 구직하는 worker에 대한 구인 목록 아이템 인터페이스
interface JobListItem {
    id: string; // 구직 아이디
    type: "FARMER" | "WORKER"; // 구직 유형
    title: string; // 구직 제목
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
    status: "OPEN" | "CLOSED"; // 구직 상태 (모집중/마감)
    createdAt: string; // 작성일
}

// 더미 구직 데이터 fetching 함수 (WORKER 타입만 반환)
async function fakeFetchWorkerJobs(page: number): Promise<{ items: JobListItem[]; hasMore: boolean }> {
    const dummyItems: JobListItem[] = Array.from({ length: 10 }).map((_, index) => {
        const id = ((page - 1) * 10 + index + 1).toString(); // 구직 아이디 생성
        return {
            id,
            type: "WORKER", // 구직하는 worker 데이터
            title: `Worker Job ${id}`, // 구직 제목
            farmName: undefined, // 일반적으로 구직자에게 농장명은 필요하지 않음
            location: { address: "Worker Address", distance: 3 }, // 예시 위치 정보
            workDate: { start: "2023-10-05", end: "2023-10-06" }, // 예시 근무 기간
            payment: { amount: 12000, unit: "HOUR" }, // 예시 급여 정보
            status: "OPEN", // 모집중 상태
            createdAt: new Date().toISOString(), // 작성일
        };
    });

    return new Promise((resolve) => {
        setTimeout(() => resolve({ items: dummyItems, hasMore: page < 3 }), 1000); // 페이지 3까지 더미 데이터 반환
    });
}

export default function WorkerFeedPage() {
    const router = useRouter();
    const [items, setItems] = useState<JobListItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 다음 페이지 데이터를 불러오는 함수
    const fetchNextPage = async () => {
        const data = await fakeFetchWorkerJobs(page);
        setItems((prev) => [...prev, ...data.items]);
        setHasMore(data.hasMore);
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        fetchNextPage();
    }, []);

    return (
        <main className="container mx-auto px-4 py-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-center">갈게요 피드</h1>
                <p className="text-center text-gray-600 mt-2">
                    현재 구직중인 포스트들을 확인하세요.
                </p>
            </header>
            <InfiniteScroll
                dataLength={items.length}
                next={fetchNextPage}
                hasMore={hasMore}
                loader={<LoadingCard />}
                endMessage={
                    <p className="text-center py-4 text-gray-500">
                        모든 구해요 포스트를 불러왔습니다.
                    </p>
                }
            >
                <div className="space-y-4">
                    {items.map((job) => (
                        <JobCard
                            key={job.id} // 구직 아이디를 키로 사용
                            job={job} // 구직 데이터 전달
                            onClick={() => router.push(`/jobs/${job.id}`)} // 클릭 시 상세 페이지로 이동
                        />
                    ))}
                </div>
            </InfiniteScroll>
            {items.length > 0 && (
                <div className="fixed bottom-8 right-8">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
                    >
                        ↑ Top
                    </button>
                </div>
            )}
        </main>
    );
} 