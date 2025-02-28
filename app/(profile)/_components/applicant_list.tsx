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

const ApplicantList: React.FC = () => {
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
            const filteredMatches = matches.filter((match: any) => match.status !== "COMPLETED");
            const applicants = mockData.applicants; // 유저 리스트 가져오기


            // 매칭된 job 리스트를 가져오기
            const matched = filteredMatches.map((match: any) => {
                if (match.workerId === userId) {
                    const job = mockData.jobPostings.find((job: Job) => job.id === match.jobPostingId);
                    if (job) {
                        // 해당 match의 workerId로 유저 정보 찾기
                        const applicant = applicants.find((applicant: any) => applicant.id === match.workerId);
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
        return <p>로딩 중...</p>;
    }

    return (
        <div className="space-y-4">
            {matchedJobs.length === 0 ? (
                <p>매칭된 작업이 없습니다.</p>
            ) : (
                matchedJobs.map((job) => (
                    <div key={job.id} className="border p-4 rounded shadow">
                        <h3 className="text-lg font-bold">{job.title}</h3>
                        <p>{job.description}</p>
                        <p>Match Status: {job.matchStatus === "PENDING" ? "지원 신청 중" : job.matchStatus === "ACCEPTED" ? "지원 승인" : job.matchStatus === "REJECTED" ? "지원 거절" : job.matchStatus === "WAITLIST" ? "대기 중" : "상태 없음"}</p>
                        <p>신청자 이름: {job.applicantName}</p>
                        <p>신청자 이메일: {job.applicantEmail}</p>
                        <p>신청자 연락처: {job.applicantContact}</p>
                        {job.matchStatus === "PENDING" && userRole === "FARMER" && (
                            <div className="flex space-x-2">
                                <Button
                                    color="red"
                                    className=" text-white px-4 py-2 rounded"
                                    onClick={() => handleReject(job.id, job.applicantId)}
                                >
                                    지원 거절
                                </Button>
                                <Button
                                    color="green"
                                    className=" text-white px-4 py-2 rounded"
                                    onClick={() => handleAccept(job.id, job.applicantId)}
                                >
                                    지원 승인
                                </Button>
                                <Button
                                    color="blue"
                                    className=" text-white px-4 py-2 rounded"
                                    onClick={() => handleRegisterWaiting(job.id, job.applicantId)}
                                >
                                    대기자 등록
                                </Button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ApplicantList;