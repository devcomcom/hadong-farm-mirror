import React, { useEffect, useState } from "react";
import { Calendar, MapPin, DollarSign, CheckCircle2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
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
    isWorkerComment: boolean;
    workerComment: string;
    location: string;
}

const CompletedJobList: React.FC = () => {
    const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCompletedJobs = async () => {
        try {
            const response = await fetch("/api/get_completed_jobs");
            const data = await response.json();
            setCompletedJobs(data.completedJobs);
        } catch (error) {
            console.error("Failed to fetch completed jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedJobs();
    }, []);

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

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">후기</span>
                                        {!job.isWorkerComment ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        color="blue"
                                                        className="flex items-center text-sm"
                                                    >
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        후기 작성
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    {/* ... (Dialog 내용) */}
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        color="green"
                                                        className="flex items-center text-sm"
                                                    >
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        후기 확인
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    {/* ... (Dialog 내용) */}
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