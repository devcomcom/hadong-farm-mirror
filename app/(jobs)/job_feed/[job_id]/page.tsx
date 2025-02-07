"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";


interface JobPostingDetail {
    id: string;
    type: "FARMER" | "WORKER";
    title: string;
    description: string;
    author: {
        id: string;
        name: string;
        profileImage?: string;
    };
    workDate: {
        start: string;
        end: string;
    };
    payment: {
        amount: number;
        unit: "DAY" | "HOUR";
    };
    location: {
        address: string;
        latitude: number;
        longitude: number;
        farmName?: string;
    };
    status: "OPEN" | "CLOSED" | "COMPLETED";
    matchStatus?: "NONE" | "PENDING" | "ACCEPTED" | "REJECTED";
    applicants?: {
        total: number;
        accepted: number;
    };
    createdAt: string;
    updatedAt: string;
}

export default function JobDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { job_id } = params;
    const [jobData, setJobData] = useState<JobPostingDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // const fetchJobDetail = async () => {
        //     try {
        //         const res = await fetch(`/api/jobs/${job_id}`);
        //         if (!res.ok) {
        //             throw new Error("Failed to fetch job detail");
        //         }
        //         const data = await res.json();
        //         // data.job 로 전달된 구인 상세 정보를 사용
        //         setJobData(data.job);
        //     } catch (err: any) {
        //         setError(err.message);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };
        // 더미 데이터를 정의합니다.
        const dummyJobData: JobPostingDetail = {
            id: "job-001",
            type: "FARMER",
            title: "더미 수확 도우미 필요",
            description: "이것은 테스트 목적으로 작성된 더미 구인 게시물 설명입니다.",
            author: {
                id: "author-001",
                name: "John Farmer",
                profileImage: "",
            },
            workDate: {
                start: "2025-09-01T00:00:00.000Z",
                end: "2025-09-30T00:00:00.000Z",
            },
            payment: {
                amount: 150,
                unit: "DAY",
            },
            location: {
                address: "123 농장 도로, 시골",
                latitude: 35.6895,
                longitude: 139.6917,
                farmName: "햇살 농장",
            },
            status: "OPEN",
            matchStatus: "PENDING",
            applicants: {
                total: 5,
                accepted: 2,
            },
            createdAt: "2023-10-06T12:00:00.000Z",
            updatedAt: "2023-10-06T12:00:00.000Z",
        };

        // 500ms 후에 더미 데이터를 상태로 설정 (네트워크 딜레이 시뮬레이션)
        const timer = setTimeout(() => {
            setJobData(dummyJobData);
            setIsLoading(false);
        }, 500);

        // if (job_id) {
        //     fetchJobDetail();
        // }
        return () => clearTimeout(timer);
    }, [job_id]);

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    if (!jobData) {
        return <div className="p-4">No job data found.</div>;
    }

    return (
        <div className="min-h-screen flex flex-col p-6 max-w-3xl mx-auto">
            <button
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => router.back()}
                aria-label="뒤로가기"
            >
                ← 뒤로가기
            </button>
            <div className="bg-white shadow rounded p-6 flex-1">
                <h1 className="text-3xl font-bold mb-2">{jobData.title}</h1>
                <p className="text-gray-600 mb-4">Posted by {jobData.author.name}</p>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                    <p className="text-gray-700 leading-relaxed">{jobData.description}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Work Date</h2>
                    <p className="text-gray-700">
                        {new Date(jobData.workDate.start).toLocaleDateString()} -{" "}
                        {new Date(jobData.workDate.end).toLocaleDateString()}
                    </p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Payment</h2>
                    <p className="text-gray-700">
                        {jobData.payment.amount}{" "}
                        {jobData.payment.unit === "DAY" ? "per day" : "per hour"}
                    </p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Location</h2>
                    <p className="text-gray-700">{jobData.location.address}</p>
                    {jobData.location.farmName && (
                        <p className="text-gray-700">Farm: {jobData.location.farmName}</p>
                    )}
                    <p className="mt-2 text-gray-600">
                        Latitude: {jobData.location.latitude}, Longitude: {jobData.location.longitude}
                    </p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Status</h2>
                    <p className="text-gray-700">{jobData.status}</p>
                </div>
                {jobData.matchStatus && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Match Status</h2>
                        <p className="text-gray-700">{jobData.matchStatus}</p>
                    </div>
                )}
                {jobData.applicants && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Applicants</h2>
                        <p className="text-gray-700">
                            Total: {jobData.applicants.total}, Accepted: {jobData.applicants.accepted}
                        </p>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <button
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition duration-200"
                    onClick={() => alert("지원하기 기능을 구현해주세요")}
                >
                    지원하기
                </button>
            </div>
        </div>
    );
}
