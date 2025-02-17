"use client";

// 필요한 훅을 임포트합니다.
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import KakaoMap from "@/components/common/kakao_map";
import { useAuthStore } from "@/stores/auth";
import Button from "@/components/common/button";

// 구인 게시물 상세 정보를 위한 인터페이스 정의
interface JobPostingDetail {
    id: string; // 구인 게시물 ID
    type: "FARMER" | "WORKER"; // 구인 유형
    title: string; // 구인 제목
    description: string; // 구인 설명
    author: {
        id: string; // 작성자 ID
        name: string; // 작성자 이름
        profileImage?: string; // 작성자 프로필 이미지 (선택적)
    };
    workDate: {
        start: string; // 근무 시작일
        end: string; // 근무 종료일
    };
    payment: {
        amount: number; // 급여 금액
        unit: "DAY" | "HOUR"; // 급여 단위 (일/시간)
    };
    location: {
        address: string; // 위치 주소
        latitude: number; // 위도
        longitude: number; // 경도
        farmName?: string; // 농장 이름 (선택적)
    };
    status: "OPEN" | "CLOSED" | "COMPLETED"; // 구인 상태
    matchStatus?: "NONE" | "PENDING" | "ACCEPTED" | "REJECTED"; // 매칭 상태 (선택적)
    applicants?: {
        total: number; // 총 지원자 수
        accepted: number; // 수락된 지원자 수
    };
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

    // 구인 상세 정보를 가져오는 useEffect
    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const res = await fetch(`/api/get_post_list`); // 구인 목록 API 호출
                if (res.ok) {
                    const data = await res.json(); // JSON 데이터 파싱
                    const jobPosting = data.jobPostings.find((job: JobPostingDetail) => job.id === job_id); // job_id에 해당하는 구인 데이터 찾기

                    if (jobPosting) {
                        setJobData(jobPosting); // 구인 데이터 설정
                        const matchData = data.matches.find((match: any) => match.jobPostingId === job_id); // 해당 job의 match 데이터 찾기
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

    // 로딩 중일 때 표시할 내용
    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    // 에러 발생 시 표시할 내용
    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    // 구인 데이터가 없을 경우 표시할 내용
    if (!jobData) {
        return <div className="p-4">No job data found.</div>;
    }

    // 구인 상세 정보 렌더링
    return (
        <div className="min-h-screen flex flex-col p-6 max-w-3xl mx-auto">
            <Button
                color="grey"
                fullWidth={true}
                onClick={() => router.back()}
            >
                ← 뒤로가기
            </Button>
            <div className="bg-white shadow rounded p-6 flex-1 mt-4">
                <h1 className="text-3xl font-bold mb-2">{jobData.title}</h1> {/* 구인 제목 */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Job Description</h2> {/* 구인 설명 제목 */}
                    <p className="text-gray-700 leading-relaxed">{jobData.description}</p> {/* 구인 설명 내용 */}
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Work Date</h2> {/* 근무 날짜 제목 */}
                    <p className="text-gray-700">
                        {new Date(jobData.workDate.start).toLocaleDateString()} -{" "}
                        {new Date(jobData.workDate.end).toLocaleDateString()} {/* 근무 시작일과 종료일 */}
                    </p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Payment</h2> {/* 급여 제목 */}
                    <p className="text-gray-700">
                        {jobData.payment.amount}{" "}
                        {jobData.payment.unit === "DAY" ? "per day" : "per hour"} {/* 급여 단위에 따른 표시 */}
                    </p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Location</h2> {/* 위치 제목 */}
                    <p className="text-gray-700">{jobData.location.address}</p> {/* 위치 주소 */}
                    {jobData.location.farmName && (
                        <p className="text-gray-700">Farm: {jobData.location.farmName}</p> // 농장 이름 (선택적)
                    )}
                    <KakaoMap latitude={jobData.location.latitude} longitude={jobData.location.longitude} />
                    <p className="mt-2 text-gray-600">
                        Latitude: {jobData.location.latitude}, Longitude: {jobData.location.longitude} {/* 위도 및 경도 */}
                    </p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Status</h2> {/* 상태 제목 */}
                    <p className="text-gray-700">{jobData.status}</p> {/* 구인 상태 */}
                </div>
                {jobData.matchStatus && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Match Status</h2> {/* 매칭 상태 제목 */}
                        <p className="text-gray-700">{jobData.matchStatus}</p> {/* 매칭 상태 내용 */}
                    </div>
                )}
                {jobData.applicants && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Applicants</h2> {/* 지원자 제목 */}
                        <p className="text-gray-700">
                            Total: {jobData.applicants.total}, Accepted: {jobData.applicants.accepted} {/* 총 지원자 수 및 수락된 지원자 수 */}
                        </p>
                    </div>
                )}
            </div>

            {userRole === 'WORKER' && (
                <div className="mt-4">
                    <Button
                        className="font-semibold py-3 hover:bg-blue-700 transition duration-200"
                        color="blue"
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/set_match', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        jobPostingId: jobData.id,
                                        workerId: "user2" // 실제 사용자 ID로 변경 필요
                                    }),
                                });

                                if (!response.ok) {
                                    throw new Error("지원하기 요청 실패");
                                }

                                const result = await response.json();
                                alert(result.message); // 성공 메시지 출력
                                setIsApplied(true); // 지원 완료 상태로 변경
                            } catch (error) {
                                console.error("Error:", error);
                                alert("지원하기 중 오류가 발생했습니다.");
                            }
                        }}
                        disabled={isApplied} // 지원 완료 시 버튼 비활성화
                        fullWidth={true}
                    >
                        {isApplied ? "지원하기 완료" : "지원하기"} {/* 버튼 텍스트 변경 */}
                    </Button>
                </div>
            )}
            {userRole === 'FARMER' && isApplied ? (
                <div className="mt-4">
                    <button
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition duration-200"
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/finish_job', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        jobPostingId: jobData.id,
                                        workerId: "user2" // 실제 사용자 ID로 변경 필요
                                    }),
                                });

                                if (!response.ok) {
                                    throw new Error("작업 완료 요청 실패");
                                }

                                const result = await response.json();
                                alert(result.message); // 성공 메시지 출력
                                setIsCompleted(false); // 작업 완료 상태로 변경
                            } catch (error) {
                                console.error("Error:", error);
                                alert("작업 완료 중 오류가 발생했습니다.");
                            }
                        }}
                        disabled={isCompleted} // 작업 완료 상태일 때 버튼 활성화
                    >
                        작업 완료
                    </button>
                    <Button
                        color="blue"
                        fullWidth={true}
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/finish_job', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        jobPostingId: jobData.id,
                                        workerId: "user2" // 실제 사용자 ID로 변경 필요
                                    }),
                                });

                                if (!response.ok) {
                                    throw new Error("작업 완료 요청 실패");
                                }

                                const result = await response.json();
                                alert(result.message); // 성공 메시지 출력
                                setIsCompleted(false); // 작업 완료 상태로 변경
                            } catch (error) {
                                console.error("Error:", error);
                                alert("작업 완료 중 오류가 발생했습니다.");
                            }
                        }}
                        disabled={isCompleted} // 작업 완료 상태일 때 버튼 활성화
                    >
                        작업 완료
                    </Button>
                </div>
            ) : ''}
        </div>
    );
}
