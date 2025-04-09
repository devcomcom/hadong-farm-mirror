"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { MapPin, Calendar, DollarSign, Users, FileText, Building2, Clock } from "lucide-react";
import KakaoMap from "@/components/common/kakao_map_location";
import { useLocationStore } from "@/stores/location";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

interface JobPostFormValues {
    title: string;
    description: string;
    jobType: "FARMER" | "WORKER";
    startDate: string;
    endDate: string;
    paymentAmount: number;
    paymentUnit: "DAY" | "HOUR";
    address: string;
    latitude: number;
    longitude: number;
    quota: number;
}

export default function JobPostCreationPage() {
    const router = useRouter();
    const latitude = useLocationStore((state) => state.latitude) || 0;
    const longitude = useLocationStore((state) => state.longitude) || 0;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<JobPostFormValues>({
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            jobType: "FARMER",
            startDate: "",
            endDate: "",
            paymentAmount: 0,
            paymentUnit: "DAY",
            quota: 0,
            address: "",
            latitude: 0,
            longitude: 0,
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const { userId } = useAuthStore();

    const renderProgressBar = () => (
        <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
            <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
        </div>
    );

    const renderStepIndicator = () => (
        <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{getStepTitle(currentStep)}</span>
        </div>
    );

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1: return "기본 정보";
            case 2: return "근무 조건";
            case 3: return "위치 정보";
            default: return "";
        }
    };

    const onSubmit: SubmitHandler<JobPostFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            data.latitude = latitude;
            data.longitude = longitude;

            const response = await fetch('/api/set_post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, userId: userId }),
            });

            if (!response.ok) throw new Error("Failed to create job posting");

            alert("구해요 게시글이 성공적으로 등록되었습니다.");
            router.push("/job_feed");
        } catch (error) {
            console.error(error);
            alert("게시글 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFormStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                <Building2 className="w-5 h-5" />
                                <span>게시물 유형</span>
                            </div>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                {...register("jobType", { required: "게시물 유형을 선택해주세요." })}
                            >
                                <option value="FARMER">농장주</option>
                            </select>
                            {errors.jobType && (
                                <p className="text-red-500 text-sm">{errors.jobType.message}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                <FileText className="w-5 h-5" />
                                <span>제목</span>
                            </div>
                            <Input
                                type="text"
                                fullWidth={true}
                                color="grey"
                                className="p-3"
                                placeholder="구인 글의 제목을 입력하세요"
                                {...register("title", { required: "제목은 필수입니다." })}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                <FileText className="w-5 h-5" />
                                <span>상세 설명</span>
                            </div>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="구인 조건과 업무 내용을 자세히 설명해주세요"
                                {...register("description", { required: "설명은 필수입니다." })}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                    <Calendar className="w-5 h-5" />
                                    <span>근무 시작일</span>
                                </div>
                                <Input
                                    type="date"
                                    fullWidth={true}
                                    color="grey"
                                    className="p-3"
                                    {...register("startDate", { required: "시작일은 필수입니다." })}
                                />
                                {errors.startDate && (
                                    <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                    <Calendar className="w-5 h-5" />
                                    <span>근무 종료일</span>
                                </div>
                                <Input
                                    type="date"
                                    fullWidth={true}
                                    color="grey"
                                    className="p-3"
                                    {...register("endDate", { required: "종료일은 필수입니다." })}
                                />
                                {errors.endDate && (
                                    <p className="text-red-500 text-sm">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                    <DollarSign className="w-5 h-5" />
                                    <span>급여</span>
                                </div>
                                <Input
                                    type="number"
                                    fullWidth={true}
                                    color="grey"
                                    className="p-3"
                                    placeholder="급여 금액"
                                    {...register("paymentAmount", {
                                        required: "급여는 필수입니다.",
                                        min: { value: 1, message: "0보다 큰 금액을 입력하세요." }
                                    })}
                                />
                                {errors.paymentAmount && (
                                    <p className="text-red-500 text-sm">{errors.paymentAmount.message}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                    <Clock className="w-5 h-5" />
                                    <span>급여 단위</span>
                                </div>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-3"
                                    {...register("paymentUnit")}
                                >
                                    <option value="DAY">일급</option>
                                    <option value="HOUR">시급</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                    <Users className="w-5 h-5" />
                                    <span>모집 인원</span>
                                </div>
                                <Input
                                    type="number"
                                    fullWidth={true}
                                    color="grey"
                                    className="p-3"
                                    placeholder="필요 인원"
                                    {...register("quota", {
                                        required: "모집 인원은 필수입니다.",
                                        min: { value: 1, message: "최소 1명 이상이어야 합니다." }
                                    })}
                                />
                                {errors.quota && (
                                    <p className="text-red-500 text-sm">{errors.quota.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                                <MapPin className="w-5 h-5" />
                                <span>근무 위치</span>
                            </div>
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    fullWidth={true}
                                    id="addressInput"
                                    color="grey"
                                    className="p-3"
                                    placeholder="주소를 입력하세요"
                                    {...register("address", { required: "주소는 필수입니다." })}
                                />
                                <Button
                                    color="blue"
                                    type="button"
                                    onClick={() => {
                                        const addressInput = document.getElementById('addressInput') as HTMLInputElement;
                                        useLocationStore.getState().setAddress(addressInput.value);
                                    }}
                                >
                                    검색
                                </Button>
                            </div>
                            {errors.address && (
                                <p className="text-red-500 text-sm">{errors.address.message}</p>
                            )}
                        </div>

                        <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300">
                            <KakaoMap latitudeLocal={35.0634} longitudeLocal={127.7532} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                step="any"
                                fullWidth={true}
                                color="grey"
                                className="p-3"
                                placeholder="위도"
                                value={latitude}
                                {...register("latitude")}
                                disabled
                            />
                            <Input
                                type="number"
                                step="any"
                                fullWidth={true}
                                color="grey"
                                className="p-3"
                                placeholder="경도"
                                value={longitude}
                                {...register("longitude")}
                                disabled
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">구인 게시글 작성</h1>

                {renderProgressBar()}
                {renderStepIndicator()}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {renderFormStep()}

                    <div className="flex justify-between pt-6">
                        {currentStep > 1 && (
                            <Button
                                color="grey"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                type="button"
                            >
                                이전
                            </Button>
                        )}
                        {currentStep < totalSteps ? (
                            <Button
                                color="blue"
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                type="button"
                                className="ml-auto"
                            >
                                다음
                            </Button>
                        ) : (
                            <Button
                                color="blue"
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                className="ml-auto"
                            >
                                {isSubmitting ? "등록 중..." : "게시글 등록"}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
} 