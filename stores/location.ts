import { create } from "zustand";

// 위치 정보를 관리하기 위한 인터페이스 정의
interface LocationStore {
    address: string; // 위치 주소
    latitude: number; // 위도
    longitude: number; // 경도
    setLocation: (address: string, latitude: number, longitude: number) => void; // 위치 설정 함수
    setAddress: (address: string) => void; // 주소 설정 함수
}

// Zustand를 사용하여 위치 정보를 관리하는 스토어 생성
export const useLocationStore = create<LocationStore>((set) => ({
    address: "", // 초기 위치 주소는 빈 문자열
    latitude: 0, // 초기 위도는 0
    longitude: 0, // 초기 경도는 0
    // 주어진 주소, 위도, 경도로 위치 설정
    setLocation: (address, latitude, longitude) =>
        set({ address, latitude, longitude }),

    setAddress: (address: string) => set({ address }),
}));
