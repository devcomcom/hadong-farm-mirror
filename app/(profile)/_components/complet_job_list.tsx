import React, { useEffect, useState } from "react";

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
}

const CompletedJobList: React.FC = () => {
    const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedJobs = async () => {
            try {
                const response = await fetch("/api/get_post_list");
                const data = await response.json();
                // 완료 상태의 job 아이템만 필터링
                const completed = data.jobPostings.filter((job: Job) => job.status === "COMPLETED");
                setCompletedJobs(completed);
            } catch (error) {
                console.error("Failed to fetch completed jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompletedJobs();
    }, []);

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
                    </div>
                ))
            )}
        </div>
    );
};

export default CompletedJobList;
