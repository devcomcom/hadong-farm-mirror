"use client";

import { useEffect } from "react";
import KakaoMap from "@/components/common/kakao_map_search"; // KakaoMap 컴포넌트 임포트

interface MapViewProps {
    items: Array<{
        id: string;
        title: string;
        location: {
            address: string;
            latitude: number;
            longitude: number;
        };
    }>;
}

const MapView: React.FC<MapViewProps> = ({ items }) => {
    // 지도에서 마커를 표시할 위치를 설정
    const defaultLocation = {
        latitude: items.length > 0 ? items[0].location.latitude : 35.063391, // 기본 위도
        longitude: items.length > 0 ? items[0].location.longitude : 127.753190, // 기본 경도
    };

    return (
        <div className="relative w-full h-96">
            <KakaoMap latitudeLocal={defaultLocation.latitude} longitudeLocal={defaultLocation.longitude} />
            {/* 마커를 추가하는 로직은 KakaoMap 컴포넌트 내에서 처리 */}
        </div>
    );
};

export default MapView;
