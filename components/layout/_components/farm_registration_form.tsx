"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { useAuthStore } from "@/stores/auth";

interface FarmRegistrationFormProps { onClose: () => void; }
interface FarmRegistrationData {
    name: string;
    description?: string;
}

const FarmRegistrationForm: React.FC<FarmRegistrationFormProps> = ({ onClose }) => {
    const { register, handleSubmit } = useForm<FarmRegistrationData>();
    const { userId } = useAuthStore();

    const onSubmit: SubmitHandler<FarmRegistrationData> = async (data) => {
        try {
            const response = await fetch('/api/register_farm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ ...data, ownerId: userId, }),
            });
            if (!response.ok) {
                throw new Error('농장 등록에 실패했습니다.');
            }
            alert('농장 등록이 완료되었습니다.');
            onClose(); // 다이얼로그 닫기 
        } catch (error) { console.error(error); alert('등록 중 오류가 발생했습니다.'); }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("name", { required: "농장 이름을 입력하세요." })} placeholder="농장 이름" className="w-full" />
            <Input {...register("description")} placeholder="농장 설명(선택)" className="w-full" /> <div className="flex justify-end">
                <Button type="button" color="grey" onClick={onClose}> 취소 </Button>
                <Button type="submit" color="blue" className="ml-2"> 등록 </Button>
            </div>
        </form>
    );
};

export default FarmRegistrationForm;