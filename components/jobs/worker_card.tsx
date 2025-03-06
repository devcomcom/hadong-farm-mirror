import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

// 구인 목록 아이템 인터페이스 (필요시 types로 분리 가능)
export interface JobListItem {
    id: string;
    type: "FARMER" | "WORKER";
    title: string;
    farmName?: string;
    location: {
        address: string;
        distance?: number;
    };
    workDate: {
        start: string;
        end: string;
    };
    payment: {
        amount: number;
        unit: "DAY" | "HOUR";
    };
    status: "OPEN" | "CLOSED";
    createdAt: string;
}

interface JobCardProps {
    job: JobListItem;
    onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
    const paymentUnitText = job.payment.unit === "DAY" ? "일" : "시간";
    const startDate = new Date(job.workDate.start).toLocaleDateString();
    const endDate = new Date(job.workDate.end).toLocaleDateString();
    const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: ko });

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -4, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer 
                transition-colors hover:border-blue-300"
        >
            <div className="p-5 space-y-4">
                {/* 헤더 섹션 */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-gray-900 line-clamp-2">
                            {job.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {job.type === "FARMER" ? "오세요" : "갈게요"}
                            {job.farmName && (
                                <span className="ml-2 font-medium text-blue-600">
                                    {job.farmName}
                                </span>
                            )}
                        </p>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium 
                            ${job.status === "OPEN"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {job.status === "OPEN" ? "구직 중" : "구직 완료"}
                    </span>
                </div>

                {/* 정보 섹션 */}
                <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">
                            {job.location.address}
                            {job.location.distance && (
                                <span className="ml-1 text-blue-600 font-medium">
                                    ({job.location.distance}km)
                                </span>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                            {startDate} ~ {endDate}
                        </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-blue-600">
                            {new Intl.NumberFormat('ko-KR').format(job.payment.amount)}원/
                            {paymentUnitText}
                        </span>
                    </div>
                </div>

                {/* 푸터 섹션 */}
                <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard; 