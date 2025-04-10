import React, { useEffect, useState } from "react";
import { Calendar, MapPin, DollarSign, CheckCircle2, MessageSquare, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import Button from "@/components/common/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth";

interface Location {
    address: string;
    latitude: number;
    longitude: number;
}

interface Job {
    id: string;
    title: string;
    description: string;
    workStartDate: string;
    workEndDate: string;
    paymentAmount: number;
    paymentUnit: string;
    status: string;
    isFarmerComment: boolean;
    isWorkerComment: boolean;
    farmerComment: string;
    workerComment: string;
    location: Location | string;
}

interface Match {
    jobPostingId: string; // 구인 게시물 ID
    workerId: string; // 지원자 ID
    farmerId: string; // 농장주 ID
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"; // 매칭 상태
}

const CompletedJobList: React.FC = () => {
    const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [review, setReview] = useState<string>("");
    const { userId } = useAuthStore();

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

    const getLocationString = (location: Location | string): string => {
        if (typeof location === 'string') {
            return location;
        }
        return location.address || '주소 정보 없음';
    };

    const fetchCompletedJobs = async () => {
        try {
            const response = await fetch("/api/get_post_list");
            const data = await response.json();
            // 완료 상태의 job 아이템만 필터링
            const completed = data.jobPostings.filter((job: Job) => job.status === "COMPLETED");
            const matches = data.matches.filter((match: Match) => match.status === "COMPLETED" && match.workerId === userId);
            setCompletedJobs(completed);
            completed.map((job: Job) => {
                const match = matches.find((match: Match) => match.jobPostingId === job.id);
                if (!match) {
                    // match가 없으면 해당 job을 삭제합니다.
                    setCompletedJobs((prevJobs) => prevJobs.filter((j) => j.id !== job.id));
                } else {
                    job.isFarmerComment = !!match.farmerComment;
                    job.isWorkerComment = !!match.workerComment;
                    job.farmerComment = match.farmerComment;
                    job.workerComment = match.workerComment;
                    if (match.workStartDate) {
                        job.workStartDate = match.workStartDate;
                    }
                    if (match.workEndDate) {
                        job.workEndDate = match.workEndDate;
                    }
                    if (match.location) {
                        job.location = match.location;
                    }
                }
            });

        } catch (error) {
            console.error("Failed to fetch completed jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedJobs();
    }, []);

    const handleReviewSubmit = async () => {
        if (!selectedJob || !review.trim()) return;

        try {
            const response = await fetch('/api/set_review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId: selectedJob.id,
                    review: review,
                    userId: userId
                }),
            });

            if (!response.ok) throw new Error('Failed to submit review');

            // 성공적으로 제출되면 상태 업데이트
            setReview("");
            setSelectedJob(null);
            fetchCompletedJobs();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('후기 제출에 실패했습니다. 다시 시도해주세요.');
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
            {completedJobs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-gray-50 rounded-lg"
                >
                    <CheckCircle2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">완료된 작업이 없습니다</h3>
                    <p className="mt-2 text-sm text-gray-500">작업을 완료하면 여기에 표시됩니다.</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 sm:grid-cols-2"
                >
                    {completedJobs.map((job) => (
                        <motion.div
                            key={job.id}
                            variants={item}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
                                hover:shadow-md transition-all duration-200"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        완료됨
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">
                                            {new Date(job.workStartDate).toLocaleDateString()} ~
                                            {new Date(job.workEndDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{getLocationString(job.location)}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        <span className="text-sm">
                                            {new Intl.NumberFormat('ko-KR').format(job.paymentAmount)}원/
                                            {job.paymentUnit === 'DAY' ? '일' : '시간'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">후기</span>
                                        {!job.isWorkerComment ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        color="blue"
                                                        className="flex items-center text-sm"
                                                        onClick={() => setSelectedJob(job)}
                                                    >
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        후기 작성
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>작업 후기 작성</DialogTitle>
                                                        <DialogDescription>
                                                            작업에 대한 솔직한 후기를 작성해주세요.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <Textarea
                                                            placeholder="후기를 작성해주세요..."
                                                            value={review}
                                                            onChange={(e) => setReview(e.target.value)}
                                                            className="min-h-[100px]"
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button color="grey">취소</Button>
                                                        </DialogClose>
                                                        <Button
                                                            color="blue"
                                                            onClick={handleReviewSubmit}
                                                            disabled={!review.trim()}
                                                        >
                                                            제출
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        color="green"
                                                        className="flex items-center text-sm"
                                                        onClick={() => setSelectedJob(job)}
                                                    >
                                                        <Star className="w-4 h-4 mr-2" />
                                                        후기 확인
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>작성된 후기</DialogTitle>
                                                        <DialogDescription>
                                                            {job.title}에 대한 후기입니다.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                        <p className="text-gray-700 whitespace-pre-wrap">
                                                            {job.farmerComment || '후기가 없습니다.'}
                                                        </p>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button color="grey">닫기</Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default CompletedJobList;
