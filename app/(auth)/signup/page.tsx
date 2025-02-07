"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignupFormValues {
    name: string;
    email: string;
    contact: string;
    password: string;
    confirmPassword: string;
    role: "FARMER" | "WORKER";
}

export default function SignupPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        defaultValues: {
            name: "",
            email: "",
            contact: "",
            password: "",
            confirmPassword: "",
            role: "WORKER",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
        setIsSubmitting(true);

        // 비밀번호와 비밀번호 확인 일치 여부 검증
        if (data.password !== data.confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            setIsSubmitting(false);
            return;
        }
        try {
            console.log("Registering user:", data);
            // 실제 API 호출로 대체 가능 (예: fetch POST 요청)
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("회원가입이 성공적으로 완료되었습니다.");
            router.push("/auth/login"); // 회원가입 후 로그인 페이지로 이동
        } catch (error) {
            console.error(error);
            alert("회원가입 중에 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 p-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center">회원가입</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">이름</label>
                        <input
                            type="text"
                            placeholder="이름을 입력하세요."
                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition"
                            {...register("name", { required: "이름은 필수 항목입니다." })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">이메일</label>
                        <input
                            type="email"
                            placeholder="이메일을 입력하세요."
                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition"
                            {...register("email", { required: "이메일은 필수 항목입니다." })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">연락처</label>
                        <input
                            type="text"
                            placeholder="연락처를 입력하세요. (예: 010-1234-5678)"
                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition"
                            {...register("contact", { required: "연락처는 필수 항목입니다." })}
                        />
                        {errors.contact && (
                            <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">비밀번호</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요."
                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition"
                            {...register("password", {
                                required: "비밀번호는 필수 항목입니다.",
                                minLength: {
                                    value: 6,
                                    message: "비밀번호는 최소 6자 이상이어야 합니다.",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">비밀번호 확인</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요."
                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition"
                            {...register("confirmPassword", {
                                required: "비밀번호 확인은 필수 항목입니다.",
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">회원 유형</label>
                        <select
                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition"
                            {...register("role", { required: "회원 유형을 선택해주세요." })}
                        >
                            <option value="FARMER">농장주</option>
                            <option value="WORKER">근로자</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition duration-200"
                        >
                            {isSubmitting ? "회원가입 중..." : "회원가입"}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm">
                        이미 계정이 있으신가요?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            로그인
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
