import React, { useEffect, useState } from "react";
import Button from "@/components/common/button";
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
import { useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth";

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
    isFarmerComment: boolean;
    isWorkerComment: boolean;
    farmerComment: string;
}

const CompletedJobList: React.FC = () => {
    const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [review, setReview] = useState<string>('');
    const { user } = useUser();
    const { userId } = useAuthStore();
    const fetchCompletedJobs = async () => {
        try {
            const response = await fetch("/api/get_post_list");
            const data = await response.json();
            // 완료 상태의 job 아이템만 필터링
            const completed = data.jobPostings.filter((job: Job) => job.status === "COMPLETED");
            const matches = data.matches.filter((match: any) => match.status === "COMPLETED" && match.workerId === userId);
            setCompletedJobs(completed);
            completed.map((job: Job) => {
                const match = matches.find((match: any) => match.jobPostingId === job.id);
                console.log('match', match);
                if (!match) {
                    console.log('match가 없습니다.');
                    // match가 없으면 해당 job을 삭제합니다.
                    setCompletedJobs((prevJobs) => prevJobs.filter((j) => j.id !== job.id));
                } else {
                    job.isFarmerComment = !!match.farmerComment;
                    job.isWorkerComment = !!match.workerComment;
                    job.farmerComment = match.farmerComment;
                }
            });
            console.log('completed', completed);

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
        if (selectedJob) {
            const response = await fetch(`/api/set_review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId: selectedJob.id,
                    review: review,
                    userId: user?.emailAddresses[0].emailAddress,
                }),
            });

            if (response.ok) {
                alert("후기가 제출되었습니다.");
                setReview('');
                setSelectedJob(null);
                fetchCompletedJobs();
            } else {
                alert("후기 제출에 실패했습니다.");
            }
        }
    };

    if (isLoading) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="space-y-4">
            {completedJobs.length === 0 ? (
                <p>완료한 작업이 없습니다.</p>
            ) : (
                completedJobs.map((job) => (
                    <div key={job.id} className="border p-4 rounded shadow">
                        <h3 className="text-lg font-bold">{job.title}</h3>
                        <p>{job.description}</p>
                        <p>
                            {job.workDate.start} - {job.workDate.end}
                        </p>
                        <p>
                            {job.payment.amount} {job.payment.unit}
                        </p>
                        <p>Status: {job.status}</p>
                        <p>
                            {job.isWorkerComment ? null : (
                                <Dialog>
                                    <DialogTrigger>
                                        <Button
                                            color="blue"
                                            className="px-4 py-2"
                                            onClick={() => setSelectedJob(job)}
                                        >
                                            후기작성
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>후기 작성</DialogTitle>
                                            <DialogDescription>
                                                {job.title}에 대한 후기를 작성하세요.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            className="w-full h-24 border rounded p-2"
                                            placeholder="후기를 입력하세요..."
                                        />
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button color="grey">취소</Button>
                                            </DialogClose>
                                            <Button color="blue" onClick={handleReviewSubmit}>
                                                제출
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                            {job.isFarmerComment && (
                                <Dialog>
                                    <DialogTrigger>
                                        <Button
                                            color="green"
                                            className="px-4 py-2"
                                            onClick={() => setSelectedJob(job)}
                                        >
                                            후기 확인
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>작성된 후기</DialogTitle>
                                            <DialogDescription>
                                                {job.title}에 대한 후기를 확인하세요.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <p>{job.farmerComment}</p>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button color="grey">닫기</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default CompletedJobList;
