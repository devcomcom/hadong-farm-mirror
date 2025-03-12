"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Edit2, Save, X, Upload } from "lucide-react";
import Tabs from "../_components/tap";
import CompletedJobList from "../_components/complet_job_list";
import CompletedJobListByFarmer from "../_components/complet_job_list_by_farmer";
import ApplicantList from "../_components/applicant_list";
import ApplicantListByFarmer from "../_components/applicant_list_by_farmer";
import Button from "@/components/common/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth";
import Input from "@/components/common/input";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";

interface UserProfile {
    name: string;
    email: string;
    contact: string;
    role: "FARMER" | "WORKER";
    profileImage?: FileList;
    profileImageUrl?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const { userRole, userId } = useAuthStore();
    const [selectedTab, setSelectedTab,] = useState("기본 정보");

    const {
        register,
        handleSubmit,
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
                role: userData.user.role,
                profileImageUrl: userData.user.profileImage, // 이미지 URL이 있다면 사용
            };
            setProfile(profile);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [isSignedIn]);

    const onSubmit: SubmitHandler<UserProfile> = async (data) => {
        setIsLoading(true);

        // profileImage가 존재하는지 확인
        if (data.profileImage && data.profileImage.length > 0) {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('profileImage', data.profileImage[0]);

            const response = await fetch('/api/set_profile', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error uploading profile image:', errorData.error);
                alert('프로필 이미지를 업로드하는 데 실패했습니다.');
                setIsLoading(false);
                return;
            }

            const result = await response.json();
            console.log('Upload result:', result);
        } else {
            console.error('프로필 이미지가 제공되지 않았습니다.');
        }

        setTimeout(() => {
            setIsEditing(false);
            setIsLoading(false);
            alert("프로필이 업데이트되었습니다.");
            fetchUserProfile();
        }, 1000);
    };

    if (isLoading || !userRole) {
        return (
            <div className="flex items-center justify-center py-10">
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">프로필</h1>
                        {!isEditing && (
                            <Button
                                color="blue"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                프로필 수정
                            </Button>
                        )}
                    </div>

                    <div className="block md:hidden">
                        <Select
                            value={selectedTab}
                            onValueChange={(value) => setSelectedTab(value)}
                        >
                            <SelectTrigger className="border border-gray-300 rounded-md p-2 flex">
                                {selectedTab}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="기본 정보">기본 정보</SelectItem>
                                <SelectItem value="완료한 작업">완료한 작업</SelectItem>
                                {userRole === "FARMER" && (
                                    <SelectItem value="농장 완료 작업">농장 완료 작업</SelectItem>
                                )}
                                <SelectItem value="지원 현황">지원 현황</SelectItem>
                                {userRole === "FARMER" && (
                                    <SelectItem value="지원자 관리">지원자 관리</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <div className="flex flex-col gap-4 mt-4">
                            <div style={{ display: selectedTab === "기본 정보" ? "block" : "none" }} label="기본 정보">
                                {isEditing ? (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-6">
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    프로필 이미지
                                                </label>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                                        {profile?.profileImageUrl ? (
                                                            <img
                                                                src={profile.profileImageUrl}
                                                                alt="현재 프로필"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-12 h-12 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            {...register("profileImage")}
                                                            className="hidden"
                                                            id="profile-upload"
                                                        />
                                                        <label
                                                            htmlFor="profile-upload"
                                                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            이미지 업로드
                                                        </label>
                                                        <p className="mt-2 text-xs text-gray-500">
                                                            권장: 500x500 이상의 정사각형 이미지 (최대 5MB)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="submit"
                                                color="blue"
                                                className="flex items-center"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                저장하기
                                            </Button>
                                            <Button
                                                type="button"
                                                color="grey"
                                                onClick={() => setIsEditing(false)}
                                                className="flex items-center"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                취소
                                            </Button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="grid gap-6 md:grid-cols-2"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex-shrink-0">
                                                {profile?.profileImageUrl && (
                                                    <img
                                                        src={profile?.profileImageUrl}
                                                        alt="프로필 이미지"
                                                        width={150}
                                                        height={150}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                )}
                                                {!profile?.profileImageUrl && (
                                                    <span className="flex items-center justify-center text-xl text-gray-500">
                                                        {profile?.name.charAt(0)}
                                                    </span>
                                                )}
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
                                    </motion.div>
                                )}
                            </div>

                            <div label="완료한 작업">
                                {selectedTab === "완료한 작업" && <CompletedJobList />}
                            </div>

                            {userRole === "FARMER" && (
                                <div label="농장 완료 작업">
                                    {selectedTab === "농장 완료 작업" && <CompletedJobListByFarmer />}
                                </div>
                            )}

                            <div label="지원 현황">
                                {selectedTab === "지원 현황" && <ApplicantList />}
                            </div>

                            {userRole === "FARMER" && (
                                <div label="지원자 관리">
                                    {selectedTab === "지원자 관리" && <ApplicantListByFarmer />}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Tabs>
                            <div label="기본 정보">
                                {isEditing ? (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-6">
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    프로필 이미지
                                                </label>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                                        {profile?.profileImageUrl ? (
                                                            <img
                                                                src={profile.profileImageUrl}
                                                                alt="현재 프로필"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-12 h-12 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            {...register("profileImage")}
                                                            className="hidden"
                                                            id="profile-upload"
                                                        />
                                                        <label
                                                            htmlFor="profile-upload"
                                                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            이미지 업로드
                                                        </label>
                                                        <p className="mt-2 text-xs text-gray-500">
                                                            권장: 500x500 이상의 정사각형 이미지 (최대 5MB)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="submit"
                                                color="blue"
                                                className="flex items-center"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                저장하기
                                            </Button>
                                            <Button
                                                type="button"
                                                color="grey"
                                                onClick={() => setIsEditing(false)}
                                                className="flex items-center"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                취소
                                            </Button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="grid gap-6 md:grid-cols-1"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex-shrink-0">
                                                {profile?.profileImageUrl && (
                                                    <img
                                                        src={profile?.profileImageUrl}
                                                        alt="프로필 이미지"
                                                        width={150}
                                                        height={150}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                )}
                                                {!profile?.profileImageUrl && (
                                                    <span className="flex items-center justify-center text-xl text-gray-500">
                                                        {profile?.name.charAt(0)}
                                                    </span>
                                                )}
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
                                    </motion.div>
                                )}
                            </div>

                            <div label="완료한 작업">
                                <CompletedJobList />
                            </div>

                            {userRole === "FARMER" && (
                                <div label="농장 완료 작업">
                                    <CompletedJobListByFarmer />
                                </div>
                            )}

                            <div label="지원 현황">
                                <ApplicantList />
                            </div>

                            {userRole === "FARMER" && (
                                <div label="지원자 관리">
                                    <ApplicantListByFarmer />
                                </div>
                            )}
                        </Tabs>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 