import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth"; // Zustand 스토어에서 useAuthStore 가져오기
import fs from "fs";
import path from "path";

interface Job {
    id: string;
    title: string;
    description: string;
    workDate: {
        start: string;
        end: string;
    };
    payment: {
        amount: number;
        unit: string;
    };
    status: string;
    userId: string; // userId 추가
}

const ApplicantList: React.FC = () => {
    const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userRole } = useAuthStore(); // Zustand 스토어에서 userRole 가져오기

    // API 호출 함수
    const fetchJobPostings = async () => {
        const response = await fetch('/api/get_post_list');
        if (!response.ok) {
            throw new Error('Failed to fetch job postings');
        }
        const data = await response.json();
        return data;
    };

    useEffect(() => {
        const fetchMatchedJobs = async () => {
            try {
                const mockData = await fetchJobPostings(); // 데이터 fetching

                // mockData에서 matches 리스트 가져오기
                const matches = mockData.matches;
                const filteredMatches = matches.filter((match: any) => match.status !== "COMPLETED");
                const applicants = mockData.applicants; // 유저 리스트 가져오기

                // 매칭된 job 리스트를 가져오기
                const matched = filteredMatches.map((match: any) => {
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
                        };
                    }
                    return null;
                }).filter((job: Job | null) => job !== null); // null 값 필터링

                setMatchedJobs(matched as Job[]); // 상태 업데이트
            } catch (error) {
                console.error("Failed to fetch matched jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchedJobs();
    }, []);

    const handleAccept = async (jobId: string) => {
        try {
            const response = await fetch('/api/set_applicant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, action: 'ACCEPTED' }),
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

    const handleReject = async (jobId: string) => {
        try {
            const response = await fetch('/api/set_applicant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, action: 'REJECTED' }),
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
                        <p>Match Status: {job.matchStatus === "PENDING" ? "지원 신청 완료" : job.matchStatus === "ACCEPTED" ? "지원 승인 완료" : job.matchStatus === "REJECTED" ? "지원 거절 완료" : "상태 없음"}</p>
                        <p>신청자 이름: {job.applicantName}</p>
                        <p>신청자 이메일: {job.applicantEmail}</p>
                        <p>신청자 연락처: {job.applicantContact}</p>
                        {job.matchStatus === "PENDING" && userRole === "FARMER" && (
                            <div className="flex space-x-2">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleReject(job.id)}
                                >
                                    지원 거절
                                </button>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleAccept(job.id)}
                                >
                                    지원 승인
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ApplicantList;