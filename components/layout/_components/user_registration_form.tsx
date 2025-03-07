"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { useAuthStore } from "@/stores/auth";


interface UserRegistrationFormProps {
    onClose: () => void;
}
interface UserRegistrationData {
    name: string;
    email: string;
    contact: string;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onClose }) => {
    const { register, handleSubmit } = useForm<UserRegistrationData>();
    const { userId } = useAuthStore();

    const onSubmit: SubmitHandler<UserRegistrationData> = async (data) => {
        try {
            const response = await fetch('/api/register_worker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    contact: data.contact,
                    userId: userId,
                }),
            });
            if (!response.ok) {
                throw new Error('일꾼 등록에 실패했습니다.');
            }
            alert('일꾼 등록이 완료되었습니다.');
            onClose(); // 다이얼로그 닫기
        } catch (error) {
            console.error(error);
            alert('등록 중 오류가 발생했습니다.');
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                {...register("name", { required: "이름을 입력하세요." })}
                placeholder="이름"
                className="w-full"
            />
            <Input
                {...register("contact", { required: "연락처를 입력하세요." })}
                placeholder="연락처"
                className="w-full"
            />
            <div className="flex justify-end">
                <Button type="button" color="grey" onClick={onClose}>
                    취소
                </Button>
                <Button type="submit" color="blue" className="ml-2">
                    등록
                </Button>
            </div>
        </form>
    );
};
export default UserRegistrationForm;