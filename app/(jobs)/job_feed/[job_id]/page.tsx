"use client";

// 필요한 훅을 임포트합니다.
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapPin, Calendar, DollarSign, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import KakaoMap from "@/components/common/kakao_map";
import { useAuthStore } from "@/stores/auth";
import Button from "@/components/common/button";

// 구인 게시물 상세 정보를 위한 인터페이스 정의
interface JobPostingDetail {
    id: string; // 구인 게시물 ID
    type: "FARMER" | "WORKER"; // 구인 유형
    title: string; // 구인 제목
    description: string; // 구인 설명
    userId: string; // 작성자 ID
    workStartDate: string; // 근무 시작일
    workEndDate: string; // 근무 종료일
    paymentAmount: number; // 급여 금액
    paymentUnit: "DAY" | "HOUR"; // 급여 단위 (일/시간)
    location: {
        address: string; // 위치 주소
        latitude: number; // 위도
        longitude: number; // 경도
    };
    status: "OPEN" | "CLOSED" | "COMPLETED"; // 구인 상태
    matchStatus?: "NONE" | "PENDING" | "ACCEPTED" | "REJECTED"; // 매칭 상태 (선택적)
    applicants?: {
        total: number; // 총 지원자 수
        accepted: number; // 수락된 지원자 수
    };
    quota: number; // 모집 인원
    createdAt: string; // 작성일
    updatedAt: string; // 수정일
}

// 구인 게시물 상세 페이지 컴포넌트
export default function JobDetailPage() {
    const router = useRouter(); // 라우터 훅 사용
    const params = useParams(); // URL 파라미터 가져오기
    const { job_id } = params; // job_id 추출
    const [jobData, setJobData] = useState<JobPostingDetail | null>(null); // 구인 데이터 상태
    const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태
    const { userRole } = useAuthStore(); // Zustand 스토어에서 userRole 가져오기
    const [isApplied, setIsApplied] = useState<boolean>(false); // 지원 완료 상태 관리
    const [isCompleted, setIsCompleted] = useState<boolean>(false); // 작업 완료 상태 관리
    const { userId } = useAuthStore(); // Zustand 스토어에서 userData 가져오기
    // 구인 상세 정보를 가져오는 useEffect
    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const res = await fetch(`/api/get_post_list`); // 구인 목록 API 호출
                if (res.ok) {
                    const data = await res.json(); // JSON 데이터 파싱
                    console.log('data', data);
                    const jobPosting = data.jobPostings.find((job: JobPostingDetail) => {
                        return job.id == job_id;
                    }); // job_id에 해당하는 구인 데이터 찾기

                    if (jobPosting) {
                        setJobData(jobPosting); // 구인 데이터 설정
                        const matchData = data.matches.find((match: any) => match.jobPostingId == job_id); // 해당 job의 match 데이터 찾기
                        if (matchData) {
                            setIsApplied(true); // match 데이터가 있으면 지원 완료 상태를 true로 설정
                        }
                        if (jobPosting.status === "COMPLETED") {
                            setIsCompleted(true); // 작업 완료 상태일 때 작업 완료 상태를 true로 설정
                        }
                    } else {
                        // job_id에 해당하는 구인 데이터가 없을 경우 JobPostingDetail 사용
                        setJobData(data.JobPostingDetail); // JobPostingDetail 배열 변수를 구인 데이터로 설정
                    }
                }
            } catch (err: any) {
                setError(err.message); // 에러 메시지 설정
            } finally {
                setIsLoading(false); // 로딩 상태 종료
            }
        };
        fetchJobData();

    }, [job_id]);

    // 로딩 상태 컴포넌트
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    // 에러 상태 컴포넌트
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">오류가 발생했습니다</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button color="blue" onClick={() => router.back()}>
                        돌아가기
                    </Button>
                </div>
            </div>
        );
    }

    if (!jobData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">구인 정보를 찾을 수 없습니다</h2>
                    <Button color="blue" onClick={() => router.back()}>
                        목록으로 돌아가기
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 상단 네비게이션 바 */}
            <div className="sticky top-0 bg-white border-b z-10 px-4 py-3 flex items-center">
                <Button
                    color="grey"
                    onClick={() => router.back()}
                    className="!px-3"
                >
                    ←
                </Button>
                <h1 className="ml-4 text-lg font-semibold truncate">{jobData.title}</h1>
            </div>

            <div className="max-w-3xl mx-auto p-6">
                {/* 헤더 섹션 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{jobData.title}</h1>
                            <p className="text-gray-600">{jobData.type === "FARMER" ? "일손 구해요" : "일하러 갈게요"}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium 
                            ${jobData.status === "OPEN"
                                ? "bg-green-100 text-green-800"
                                : jobData.status === "COMPLETED"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"}`}>
                            {jobData.status === "OPEN" ? "모집중" :
                                jobData.status === "COMPLETED" ? "완료됨" : "마감"}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* 설명 */}
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-line">{jobData.description}</p>
                        </div>

                        {/* 주요 정보 그리드 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">근무 기간</p>
                                    <p className="font-medium">
                                        {new Date(jobData.workStartDate).toLocaleDateString()} - {new Date(jobData.workEndDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <DollarSign className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-500">급여</p>
                                    <p className="font-medium">
                                        {new Intl.NumberFormat('ko-KR').format(jobData.paymentAmount)}원
                                        /{jobData.paymentUnit === "DAY" ? "일" : "시간"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <Users className="h-5 w-5 text-purple-500" />
                                <div>
                                    <p className="text-sm text-gray-500">모집 인원</p>
                                    <p className="font-medium">{jobData.quota}명</p>
                                </div>
                            </div>

                            {jobData.applicants && (
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">지원 현황</p>
                                        <p className="font-medium">
                                            {jobData.applicants.accepted}/{jobData.applicants.total}명 수락됨
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 위치 정보 섹션 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">위치 정보</h2>
                    <div className="flex items-center mb-4">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-700">{jobData.location.address}</p>
                    </div>
                    <div className="h-[300px] rounded-lg overflow-hidden">
                        <KakaoMap
                            latitude={jobData.location.latitude}
                            longitude={jobData.location.longitude}
                        />
                    </div>
                </div>

                {/* 작업 상태 및 액션 버튼 */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
                    <div className="max-w-3xl mx-auto">
                        {userRole === 'WORKER' && (
                            <Button
                                color={isApplied ? "grey" : "blue"}
                                onClick={async () => {
                                    if (isApplied) return;
                                    try {
                                        const response = await fetch('/api/set_match', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                jobPostingId: jobData.id,
                                                workerId: userId,
                                                farmerId: jobData.userId,
                                            }),
                                        });

                                        if (!response.ok) throw new Error("지원하기 요청 실패");

                                        const result = await response.json();
                                        alert(result.message);
                                        setIsApplied(true);
                                    } catch (error) {
                                        console.error("Error:", error);
                                        alert("지원하기 중 오류가 발생했습니다.");
                                    }
                                }}
                                disabled={isApplied}
                                fullWidth={true}
                                className="py-3 text-lg font-medium"
                            >
                                {isApplied ? "지원 완료" : "지원하기"}
                            </Button>
                        )}

                        {userRole === 'FARMER' && isApplied && (
                            <Button
                                color={isCompleted ? "grey" : "blue"}
                                onClick={async () => {
                                    if (isCompleted) return;
                                    try {
                                        const response = await fetch('/api/finish_job', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                jobPostingId: jobData.id,
                                                farmerId: userId,
                                            }),
                                        });

                                        if (!response.ok) throw new Error("작업 완료 요청 실패");

                                        const result = await response.json();
                                        alert(result.message);
                                        setIsCompleted(true);
                                    } catch (error) {
                                        console.error("Error:", error);
                                        alert("작업 완료 처리 중 오류가 발생했습니다.");
                                    }
                                }}
                                disabled={isCompleted}
                                fullWidth={true}
                                className="py-3 text-lg font-medium"
                            >
                                {isCompleted ? "작업 완료됨" : "작업 완료하기"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
