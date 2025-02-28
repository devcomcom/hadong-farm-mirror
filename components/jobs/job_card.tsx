import React from "react";

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
    work_start_date: string;
    work_end_date: string;
    payment_amount: number;
    payment_unit: "DAY" | "HOUR";
    status: "OPEN" | "CLOSED";
    quota: number;
    createdAt: string;
}

interface JobCardProps {
    job: JobListItem;
    onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
    // 급여 단위를 한글로 변환
    const paymentUnitText =
        job.payment_unit === "DAY" ? "일" : job.payment_unit === "HOUR" ? "시간" : job.payment_unit;

    // 근무 시작/종료일 포맷 (추후 Date 라이브러리 사용 고려)
    const startDate = new Date(job.work_start_date).toLocaleDateString();
    const endDate = new Date(job.work_end_date).toLocaleDateString();

    return (
        <div
            onClick={onClick}
            className="p-4 border rounded shadow cursor-pointer hover:bg-gray-50"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{job.title}</h2>
                <span
                    className={`px-2 py-1 text-sm rounded ${job.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                >
                    {job.status === "OPEN" ? "모집중" : "마감"}
                </span>
            </div>
            <p className="text-sm text-gray-500">
                {job.type === "FARMER" ? "오세요" : "갈게요"}
                {job.farmName && ` - ${job.farmName}`}
            </p>
            <p className="text-sm">
                위치: {job.location.address}{" "}
                {job.location.distance ? `(${job.location.distance}km)` : ""}
            </p>
            <p className="text-sm">
                근무 기간: {startDate} ~ {endDate}
            </p>
            <p className="text-sm">
                급여: {job.payment_amount}원/{paymentUnitText}
            </p>
            <p className="text-sm">
                모집 인원: {job.quota}명
            </p>
            <p className="text-xs text-gray-400">
                작성일: {new Date(job.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};

export default JobCard; 