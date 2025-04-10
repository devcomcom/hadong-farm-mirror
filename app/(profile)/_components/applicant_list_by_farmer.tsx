import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth"; // Zustand 스토어에서 useAuthStore 가져오기
import Button from "@/components/common/button";


interface Job {
    id: string;
    title: string;
    description: string;
    workDateStart: string;
    workDateEnd: string;
    paymentAmount: number;
    paymentUnit: string;
    status: string;
    userId: string; // userId 추가
    matchStatus: string;
    applicantName: string;
    applicantEmail: string;
    applicantContact: string;
    applicantId: string;
}

// Match 인터페이스 정의
interface Match {
    jobPostingId: string; // 구인 게시물 ID
    workerId: string; // 지원자 ID
    farmerId: string; // 농장주 ID
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"; // 매칭 상태
}

interface User {
    id: string;
    name: string;
    email: string;
    contact: string;
    location: string;
    role: "FARMER" | "WORKER";
}

const ApplicantListByFarmer: React.FC = () => {
    const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userRole } = useAuthStore(); // Zustand 스토어에서 userRole 가져오기
    const { userId } = useAuthStore(); // Zustand 스토어에서 userId 가져오기

    // API 호출 함수
    const fetchJobPostings = async () => {
        const response = await fetch('/api/get_post_list');
        if (!response.ok) {
            throw new Error('Failed to fetch job postings');
        }
        const data = await response.json();
        return data;
    };

    const fetchMatchedJobs = async () => {
        try {
            const mockData = await fetchJobPostings(); // 데이터 fetching

            // mockData에서 matches 리스트 가져오기
            const matches = mockData.matches;
            console.log('matches', matches);
            const filteredMatches = matches.filter((match: Match) => match.status !== "COMPLETED");
            const applicants = mockData.applicants; // 유저 리스트 가져오기


            // 매칭된 job 리스트를 가져오기
            const matched = filteredMatches.map((match: Match) => {
                if (match.farmerId === userId) {
                    console.log('match', match);
                    const job = mockData.jobPostings.find((job: Job) => job.id === match.jobPostingId);
                    if (job) {
                        // 해당 match의 workerId로 유저 정보 찾기
                        const applicant = applicants.find((applicant: User) => applicant.id === match.workerId);
                        return {
                            ...job,
                            matchStatus: match.status,
                            applicantName: applicant ? applicant.name : "Unknown", // 유저 이름
                            applicantEmail: applicant ? applicant.email : "Unknown", // 유저 이메일
                            applicantContact: applicant ? applicant.contact : "Unknown", // 유저 연락처
                            applicantId: applicant ? applicant.id : "Unknown", // 유저 id
                        };
                    }
                    return null;
                } else {
                    return null;
                }
            }).filter((job: Job | null) => job !== null); // null 값 필터링

            console.log(matched);

            setMatchedJobs(matched as Job[]); // 상태 업데이트
        } catch (error) {
            console.error("Failed to fetch matched jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMatchedJobs();
    }, []);

    const handleAccept = async (jobId: string, applicantId: string) => {
        try {
            const response = await fetch('/api/set_applicant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, applicantId, action: 'ACCEPTED' }),
            });

            if (!response.ok) {
                throw new Error('Failed to accept the job');
            }

            const result = await response.json();
            console.log(result.message);
            // 매칭된 job의 상태를 ACCEPTED로 변경
            const updatedMatches = matchedJobs.map((job) => {
                if (job.id === jobId) {
                    return { ...job, matchStatus: "ACCEPTED" };
                }
                return job;
            });
            setMatchedJobs(updatedMatches);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (jobId: string, applicantId: string) => {
        try {
            const response = await fetch('/api/set_applicant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, applicantId, action: 'REJECTED' }),
            });

            if (!response.ok) {
                throw new Error('Failed to reject the job');
            }

            const result = await response.json();
            console.log(result.message);
            // 매칭된 job의 상태를 REJECTED로 변경
            const updatedMatches = matchedJobs.map((job) => {
                if (job.id === jobId) {
                    return { ...job, matchStatus: "REJECTED" };
                }
                return job;
            });
            setMatchedJobs(updatedMatches);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegisterWaiting = async (jobId: string, applicantId: string) => {
        try {
            const response = await fetch('/api/set_applicant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, applicantId, action: 'WAITLIST' }),
            });

            if (!response.ok) {
                throw new Error('Failed to register waiting');
            }
            const result = await response.json();
            console.log(result.message);
            // 매칭된 job의 상태를 WAITLIST로 변경
            const updatedMatches = matchedJobs.map((job) => {
                if (job.id === jobId) {
                    return { ...job, matchStatus: "WAITLIST" };
                }
                return job;
            });
            setMatchedJobs(updatedMatches);
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {matchedJobs.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">아직 지원자가 없습니다.</p>
                </div>
            ) : (
                matchedJobs.map((job) => (
                    <div key={job.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
                            transition-all duration-200 hover:shadow-md">
                        {/* 상태 배지 */}
                        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                ${job.matchStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                    job.matchStatus === "ACCEPTED" ? "bg-green-100 text-green-800" :
                                        job.matchStatus === "REJECTED" ? "bg-red-100 text-red-800" :
                                            job.matchStatus === "WAITLIST" ? "bg-blue-100 text-blue-800" :
                                                "bg-gray-100 text-gray-800"}`}>
                                {job.matchStatus === "PENDING" ? "지원 신청 중" :
                                    job.matchStatus === "ACCEPTED" ? "지원 승인" :
                                        job.matchStatus === "REJECTED" ? "지원 거절" :
                                            job.matchStatus === "WAITLIST" ? "대기 중" : "상태 없음"}
                            </span>
                        </div>

                        {/* 지원자 정보 */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">지원자 정보</p>
                                    <div className="space-y-1">
                                        <p className="text-sm">
                                            <span className="font-medium">이름:</span> {job.applicantName}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">이메일:</span> {job.applicantEmail}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">연락처:</span> {job.applicantContact}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">작업 정보</p>
                                    <div className="space-y-1">
                                        <p className="text-sm">
                                            <span className="font-medium">시작일:</span> {new Date(job.workDateStart).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">종료일:</span> {new Date(job.workDateEnd).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">급여:</span> {job.paymentAmount}원/{job.paymentUnit}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 작업 설명 */}
                            <div className="text-sm text-gray-600 border-t pt-4">
                                {job.description}
                            </div>

                            {/* 액션 버튼 */}
                            {job.matchStatus === "PENDING" && userRole === "FARMER" && (
                                <div className="flex flex-wrap gap-2 pt-4 border-t">
                                    <Button
                                        color="green"
                                        onClick={() => handleAccept(job.id, job.applicantId)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        승인하기
                                    </Button>
                                    <Button
                                        color="blue"
                                        onClick={() => handleRegisterWaiting(job.id, job.applicantId)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        대기자로 등록
                                    </Button>
                                    <Button
                                        color="red"
                                        onClick={() => handleReject(job.id, job.applicantId)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        거절하기
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ApplicantListByFarmer;