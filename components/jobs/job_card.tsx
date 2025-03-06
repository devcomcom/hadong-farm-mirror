import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MapPin, Calendar, Users, Clock, Coins } from "lucide-react";

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
    workStartDate: string;
    workEndDate: string;
    paymentAmount: number;
    paymentUnit: "DAY" | "HOUR";
    status: "OPEN" | "CLOSED";
    quota: number;
    createdAt: string;
}

interface JobCardProps {
    job: JobListItem;
    onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
    const paymentUnitText = job.paymentUnit === "DAY" ? "일" : "시간";
    const startDate = new Date(job.workStartDate).toLocaleDateString();
    const endDate = new Date(job.workEndDate).toLocaleDateString();
    const timeAgo = formatDistanceToNow(new Date(job.createdAt), {
        addSuffix: true,
        locale: ko
    });

    return (
        <div
            onClick={onClick}
            className="group relative p-6 bg-white border rounded-lg shadow-sm 
                      transition-all duration-300 ease-in-out hover:shadow-md 
                      hover:border-blue-200 cursor-pointer"
        >
            {/* 상태 뱃지 */}
            <div className="absolute top-4 right-4">
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${job.status === "OPEN"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        } transition-colors duration-200`}
                >
                    {job.status === "OPEN" ? "모집중" : "마감"}
                </span>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="space-y-4">
                {/* 제목 및 타입 */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 
                                 transition-colors duration-200">
                        {job.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {job.type === "FARMER" ? "오세요" : "갈게요"}
                        {job.farmName && ` · ${job.farmName}`}
                    </p>
                </div>

                {/* 주요 정보 */}
                <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                            {job.location.address}
                            {job.location.distance &&
                                <span className="ml-1 text-blue-600 font-medium">
                                    {job.location.distance}km
                                </span>
                            }
                        </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                            {startDate} ~ {endDate}
                        </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                        <Coins className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                            {new Intl.NumberFormat('ko-KR').format(job.paymentAmount)}원/
                            {paymentUnitText}
                        </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">모집 인원 {job.quota}명</span>
                    </div>
                </div>

                {/* 작성 시간 */}
                <div className="flex items-center text-gray-400 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeAgo}
                </div>
            </div>

            {/* 호버 효과 */}
            <div className="absolute inset-0 border-2 border-transparent 
                          group-hover:border-blue-400 rounded-lg 
                          transition-all duration-300 pointer-events-none" />
        </div>
    );
};

export default JobCard; 