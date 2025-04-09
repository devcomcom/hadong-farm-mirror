"use client"

import { useAuthStore } from "@/stores/auth";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RoleToggle: React.FC = () => {
    // useAuthStore를 사용하여 현재 역할 상태를 관리합니다.
    const { userRole, setRole } = useAuthStore();

    return (
        <div className="flex items-center space-x-2">
            <span className="font-medium">현재 역할:</span>
            <Tabs
                defaultValue={userRole}
                onValueChange={(value) =>
                    setRole(value as "FARMER" | "WORKER")
                }
                className="flex rounded-md overflow-hidden"
            >
                <TabsList className="flex p-1">
                    <TabsTrigger
                        value="FARMER"
                        className="px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-100"
                    >
                        농장주
                    </TabsTrigger>
                    <TabsTrigger
                        value="WORKER"
                        className="px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-100 active:bg-blue-100"
                    >
                        근로자
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default RoleToggle; 