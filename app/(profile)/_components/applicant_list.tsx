import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth"; // Zustand 스토어에서 useAuthStore 가져오기
import Button from "@/components/common/button";
import { motion } from "framer-motion";
import { Calendar, MapPin, DollarSign, User, Mail, Phone, Clock } from "lucide-react";

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
    location: string;
}

// Match 인터페이스 정의
interface Match {
    jobPostingId: string; // 구인 게시물 ID
    workerId: string; // 지원자 ID
    farmerId: string; // 농장주 ID
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"; // 매칭 상태
    // 필요한 다른 필드 추가
}

interface User {
    id: string;
    name: string;
    email: string;
    contact: string;
    location: string;
    role: "FARMER" | "WORKER";
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
            const filteredMatches = matches.filter((match: Match) => match.status !== "COMPLETED");
            const applicants = mockData.applicants; // 유저 리스트 가져오기

            // 매칭된 job 리스트를 가져오기
            const matched = filteredMatches.map((match: Match) => {
                if (match.workerId === userId) {
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
                            location: applicant ? applicant.location : "Unknown", // 유저 위치
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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "지원 신청 중" },
            ACCEPTED: { bg: "bg-green-100", text: "text-green-800", label: "지원 승인" },
            REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "지원 거절" },
            WAITLIST: { bg: "bg-blue-100", text: "text-blue-800", label: "대기 중" }
        };

        const config = statusConfig[status as keyof typeof statusConfig] ||
            { bg: "bg-gray-100", text: "text-gray-800", label: "상태 없음" };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {matchedJobs.length === 0 ? (
                <motion.div
                    variants={item}
                    className="text-center py-12 bg-gray-50 rounded-lg"
                >
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">지원 내역이 없습니다</h3>
                    <p className="mt-2 text-sm text-gray-500">작업에 지원하면 여기에 표시됩니다.</p>
                </motion.div>
            ) : (
                matchedJobs.map((job) => (
                    <motion.div
                        key={job.id}
                        variants={item}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
                            hover:shadow-md transition-all duration-200"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                {getStatusBadge(job.matchStatus)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">
                                            {new Date(job.workDateStart).toLocaleDateString()} ~
                                            {new Date(job.workDateEnd).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{job.location}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        <span className="text-sm">
                                            {new Intl.NumberFormat('ko-KR').format(job.paymentAmount)}원/
                                            {job.paymentUnit === 'DAY' ? '일' : '시간'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <User className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{job.applicantName}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{job.applicantEmail}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{job.applicantContact}</span>
                                    </div>
                                </div>
                            </div>

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
                    </motion.div>
                ))
            )}
        </motion.div>
    );
};

export default ApplicantList;