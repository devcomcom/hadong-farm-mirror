import { create } from "zustand";

// 인증 상태 및 사용자 역할을 관리하기 위한 인터페이스 정의
interface AuthStore {
    isAuthenticated: boolean; // 인증 여부
    userRole: "FARMER" | "WORKER"; // 사용자 역할
    toggleAuth: () => void; // 인증 상태 토글 함수
    setRole: (role: "FARMER" | "WORKER") => void; // 역할 설정 함수
    userId: string; // 사용자 아이디
    setUserId: (userId: string) => void; // 사용자 아이디 설정 함수
}

// Zustand를 사용하여 인증 상태를 관리하는 스토어 생성
export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: true, // 초기 인증 상태는 true
    userRole: "FARMER", // 초기 사용자 역할은 FARMER
    // 인증 상태를 토글하는 함수로 현재 인증 상태를 반전시킴
    toggleAuth: () =>
        set((state) => ({
            isAuthenticated: !state.isAuthenticated,
        })),
    setRole: (role) => set({ userRole: role }), // 주어진 역할로 사용자 역할 설정
    userId: "", // 사용자 아이디 초기화
    setUserId: (userId) => set({ userId }), // 사용자 아이디 설정
}));
