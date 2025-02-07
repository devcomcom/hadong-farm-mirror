"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormValues {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState("");

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        setIsSubmitting(true);
        setLoginError("");
        try {
            console.log("Logging in with:", data);
            // 실제 로그인 API 호출 부분으로 변경 가능합니다.
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // 예시: 비밀번호가 "password"가 아닐 경우 에러 발생
            if (data.password !== "password") {
                throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
            }

            router.push("/"); // 로그인 성공 시 홈 페이지로 이동
        } catch (error: any) {
            setLoginError(error.message || "로그인에 실패하였습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 p-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center">로그인</h1>
                {loginError && (
                    <p className="text-red-500 text-center">{loginError}</p>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">이메일</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition"
                            placeholder="이메일을 입력하세요."
                            {...register("email", { required: "이메일은 필수입니다." })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">비밀번호</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition"
                            placeholder="비밀번호를 입력하세요."
                            {...register("password", { required: "비밀번호는 필수입니다." })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition duration-200"
                        >
                            {isSubmitting ? "로그인 중..." : "로그인"}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm">
                        계정이 없으신가요?{" "}
                        <a href="/signup" className="text-blue-600 hover:underline">
                            회원가입
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
} 