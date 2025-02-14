"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import KakaoMap from "@/components/common/kakao_map_location";
import { useLocationStore } from "@/stores/location";

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
}

export default function JobPostCreationPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<JobPostFormValues>({
        defaultValues: {
            title: "",
            description: "",
            jobType: "FARMER",
            startDate: "",
            endDate: "",
            paymentAmount: 0,
            paymentUnit: "DAY",
            address: "",
            latitude: 0,
            longitude: 0,
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit: SubmitHandler<JobPostFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            // 실제 API 호출 부분으로 변경 가능 (예: fetch POST 요청)
            console.log("Submitting data:", data);

            data.latitude = useLocationStore.getState().latitude;
            data.longitude = useLocationStore.getState().longitude;

            console.log("Submitting data:", data);

            const response = await fetch('/api/set_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error("Failed to create job posting");
            }
            const result = await response.json();
            console.log("Job posting created:", result);
            alert("구해요 포스트가 성공적으로 작성되었습니다.");
            // router.push("/jobs"); // 작성 완료 후 구해요 목록 페이지로 이동
        } catch (error) {
            console.error(error);
            alert("포스트 작성 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-6" style={{ minHeight: 'calc(100vh - 400px)' }}>
            <h1 className="text-3xl font-bold mb-6">게시물 작성</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-2xl bg-white shadow rounded p-6 space-y-4"
            >
                <div>
                    <label className="block font-semibold mb-1">게시물 유형</label>
                    <select
                        className="w-full border border-gray-300 rounded p-2"
                        {...register("jobType", { required: "게시물 유형을 선택해주세요." })}
                    >
                        <option value="FARMER">농장주</option>
                        {/* <option value="WORKER">근로자</option> */}
                    </select>
                    {errors.jobType && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.jobType.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block font-semibold mb-1">제목</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="글 제목을 입력하세요."
                        {...register("title", { required: "제목은 필수입니다." })}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block font-semibold mb-1">설명</label>
                    <textarea
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="게시물 내용을 입력하세요."
                        rows={5}
                        {...register("description", { required: "설명은 필수입니다." })}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">근무 시작일</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded p-2"
                            {...register("startDate", { required: "시작일은 필수입니다." })}
                        />
                        {errors.startDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.startDate.message}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">근무 종료일</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded p-2"
                            {...register("endDate", { required: "종료일은 필수입니다." })}
                        />
                        {errors.endDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.endDate.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">급여 금액</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded p-2"
                            placeholder="급여 금액"
                            {...register("paymentAmount", {
                                required: "급여 금액은 필수입니다.",
                                valueAsNumber: true,
                            })}
                        />
                        {errors.paymentAmount && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.paymentAmount.message}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">급여 단위</label>
                        <select
                            className="w-full border border-gray-300 rounded p-2"
                            {...register("paymentUnit", { required: "급여 단위는 필수입니다." })}
                        >
                            <option value="DAY">일</option>
                            <option value="HOUR">시간</option>
                        </select>
                        {errors.paymentUnit && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.paymentUnit.message}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block font-semibold mb-1">위치 (주소)</label>
                    <input
                        type="text"
                        id="addressInput"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="예: 123 농장 도로, 시골"
                        {...register("address", { required: "주소를 입력해주세요." })}
                    />

                    <button
                        type="button"
                        className="mt-2 w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition duration-200"
                        onClick={() => {
                            const addressInput = document.getElementById('addressInput') as HTMLInputElement;
                            const address = addressInput.value;
                            console.log(address);
                            useLocationStore.getState().setAddress(address);
                        }}
                    >
                        주소 입력
                    </button>

                    <input
                        type="number"
                        step="any"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="위도 입력"
                        value={useLocationStore((state) => state.latitude) || 0} // Zustand 상태값으로 변경
                        {...register("latitude", { required: "" })}
                    />
                    <input
                        type="number"
                        step="any"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="경도 입력"
                        value={useLocationStore((state) => state.longitude) || 0} // Zustand 상태값으로 변경
                        {...register("longitude", { required: "" })}
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.address.message}
                        </p>
                    )}
                    <KakaoMap latitudeLocal={35.0634} longitudeLocal={127.7532} />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition duration-200"
                    >
                        {isSubmitting ? "작성 중..." : "작성하기"}
                    </button>
                </div>
            </form>
        </div>
    );
} 