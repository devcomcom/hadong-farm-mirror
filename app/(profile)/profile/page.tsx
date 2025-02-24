"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Tabs from "../_components/tap";
import CompletedJobList from "../_components/complet_job_list";
import CompletedJobListByFarmer from "../_components/complet_job_list_by_farmer";
import ApplicantList from "../_components/applicant_list";
import Button from "@/components/common/button";
import { useAuth, useUser } from "@clerk/nextjs";

interface UserProfile {
    name: string;
    email: string;
    contact: string;
    role: "FARMER" | "WORKER";
    profileImage?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserProfile>();

    const fetchUserProfile = async () => {
        if (!isSignedIn) {
            return;
        }
        const email = user?.emailAddresses[0].emailAddress; // 이메일을 파라미터로 추가
        const response = await fetch(`/api/get_auth?email=${encodeURIComponent(email as string)}`); // 사용자 정보를 가져오는 API 호출

        if (response.ok) {
            const userData = await response.json();
            console.log(userData);
            const profile: UserProfile = {
                name: userData.user.name,
                email: userData.user.email,
                contact: userData.user.contact,
                role: userData.user.roles[0].role,
                profileImage: userData.user.profileImage, // 이미지 URL이 있다면 사용
            };
            setProfile(profile);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [isSignedIn]);

    const onSubmit: SubmitHandler<UserProfile> = (data) => {
        // 모의 API를 통해 업데이트한 후, 상태를 갱신합니다.
        setIsLoading(true);
        setTimeout(() => {
            setProfile(data);
            setIsEditing(false);
            setIsLoading(false);
            alert("프로필이 업데이트되었습니다.");
        }, 1000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-gray-100">
            <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">프로필</h1>
                <Tabs>
                    <div label="기본 정보">
                        {isEditing ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-1">이름</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded p-2"
                                        {...register("name", { required: "이름은 필수 입니다." })}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block font-semibold mb-1">이메일</label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 rounded p-2"
                                        {...register("email", { required: "이메일은 필수 입니다." })}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block font-semibold mb-1">연락처</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded p-2"
                                        {...register("contact", { required: "연락처는 필수 입니다." })}
                                    />
                                    {errors.contact && (
                                        <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block font-semibold mb-1">회원 유형</label>
                                    <select
                                        className="w-full border border-gray-300 rounded p-2"
                                        {...register("role", { required: "회원 유형을 선택해주세요." })}
                                    >
                                        <option value="FARMER">농장주</option>
                                        <option value="WORKER">근로자</option>
                                    </select>
                                    {errors.role && (
                                        <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        color="blue"
                                        fullWidth={true}
                                        type="submit"
                                    >
                                        저장
                                    </Button>

                                    <Button
                                        color="grey"
                                        fullWidth={true}
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            reset(profile!);
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                                    >
                                        취소
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex-shrink-0">
                                        {/* 프로필 이미지가 있을 경우 아래와 같이 img 태그를 사용할 수 있습니다.
                <img src={profile?.profileImage} alt="프로필 이미지" className="w-full h-full object-cover rounded-full" /> */}
                                        <span className="flex items-center justify-center text-xl text-gray-500">
                                            {profile?.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{profile?.name}</h2>
                                        <p className="text-gray-600">{profile?.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>
                                        <span className="font-semibold">연락처:</span> {profile?.contact}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <span className="font-semibold">회원 유형:</span>{" "}
                                        {profile?.role === "FARMER" ? "농장주" : "근로자"}
                                    </p>
                                </div>
                                <Button
                                    color="blue"
                                    fullWidth={true}
                                    onClick={() => setIsEditing(true)}
                                >
                                    프로필 수정
                                </Button>
                            </div>
                        )}
                    </div>
                    <div label="완료한 구해요 리스트">
                        <CompletedJobList />
                    </div>
                    <div label="완료한 구해요 리스트(농장주)">
                        <CompletedJobListByFarmer />
                    </div>
                    <div label="지원자 리스트">
                        <ApplicantList />
                    </div>
                </Tabs>
            </div>
        </div>
    );
} 