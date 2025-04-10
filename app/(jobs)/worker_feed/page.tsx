"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import JobCard from "@/components/jobs/worker_card";
import LoadingCard from "@/components/jobs/loading_card";
import { Search, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

interface FilterOptions {
    sortBy: 'latest' | 'payment' | 'distance';
    paymentUnit: 'ALL' | 'DAY' | 'HOUR';
    status: 'ALL' | 'OPEN' | 'CLOSED';
}

export default function WorkerFeedPage() {
    const router = useRouter();
    const [items, setItems] = useState<JobListItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<FilterOptions>({
        sortBy: 'latest',
        paymentUnit: 'ALL',
        status: 'ALL'
    });
    const [showFilters, setShowFilters] = useState(false);

    const fetchNextPage = async () => {
        try {
            setIsLoading(true);
            const data = await fakeFetchWorkerJobs(page);
            setItems((prev) => [...prev, ...data.items]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNextPage();
    }, []);

    const filteredItems = items.filter(item => {
        if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (filters.paymentUnit !== 'ALL' && item.payment.unit !== filters.paymentUnit) {
            return false;
        }
        if (filters.status !== 'ALL' && item.status !== filters.status) {
            return false;
        }
        return true;
    });

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-center text-gray-900">갈게요 피드</h1>
                    <p className="text-center text-gray-600 mt-2">
                        현재 구직중인 포스트들을 확인하세요.
                    </p>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 space-y-4"
                >
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="제목으로 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
                        >
                            <Filter className="w-5 h-5" />
                            필터
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm"
                            >
                                <Select
                                    value={filters.sortBy}
                                    onValueChange={(value: "latest" | "payment" | "distance") =>
                                        setFilters(prev => ({ ...prev, sortBy: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="정렬 기준" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">최신순</SelectItem>
                                        <SelectItem value="payment">급여순</SelectItem>
                                        <SelectItem value="distance">거리순</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.paymentUnit}
                                    onValueChange={(value: "ALL" | "DAY" | "HOUR") =>
                                        setFilters(prev => ({ ...prev, paymentUnit: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="급여 단위" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">전체</SelectItem>
                                        <SelectItem value="DAY">일급</SelectItem>
                                        <SelectItem value="HOUR">시급</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.status}
                                    onValueChange={(value: "ALL" | "OPEN" | "CLOSED") =>
                                        setFilters(prev => ({ ...prev, status: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="모집 상태" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">전체</SelectItem>
                                        <SelectItem value="OPEN">모집중</SelectItem>
                                        <SelectItem value="CLOSED">마감</SelectItem>
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                        <p className="text-gray-600">로딩 중...</p>
                    </div>
                ) : (
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
                        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredItems.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onClick={() => router.push(`/jobs/${job.id}`)}
                                />
                            ))}
                        </motion.div>
                    </InfiniteScroll>
                )}
            </div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: items.length > 0 ? 1 : 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-8 right-8 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg 
                    hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
                Top ↑
            </motion.button>
        </main>
    );
} 