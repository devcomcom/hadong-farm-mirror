import { create } from "zustand";

// 인증 상태 및 사용자 역할을 관리하기 위한 인터페이스 정의
interface AuthStore {
    isAuthenticated: boolean; // 인증 여부
    userRole: "FARMER" | "WORKER"; // 사용자 역할
    toggleAuth: () => void; // 인증 상태 토글 함수
    setRole: (role: "FARMER" | "WORKER") => void; // 역할 설정 함수
}

// Zustand를 사용하여 인증 상태를 관리하는 스토어 생성
export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: true, // 초기 인증 상태는 true
    userRole: "FARMER", // 초기 사용자 역할은 FARMER
    toggleAuth: () =>
        set(() => ({
            isAuthenticated: true, // 임시로 로그인 상태로 설정
        })),
    setRole: (role) => set({ userRole: role }), // 주어진 역할로 사용자 역할 설정
}));
