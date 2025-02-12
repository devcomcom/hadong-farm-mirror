"use client";

// 필요한 훅을 임포트합니다.
/*global kakao*/
import Script from "next/script";

declare global {
    interface Window {
        kakao: any;
    }
}

// KakaoMap 컴포넌트 정의
export default function KakaoMap({ latitude, longitude }: { latitude: number; longitude: number }) {
    // 카카오 맵 API 로드
    const loadKakaoMap = () => {
        if (!window.kakao) {
            console.error("Kakao Map API is not loaded.");
            return;
        }

        //33.5563, 126.79581
        window.kakao.maps.load(() => {
            // 결과값 위치 좌표
            const coords = new window.kakao.maps.LatLng(latitude, longitude);

            // 지도를 담을 영역의 DOM 레퍼런스
            const container = document.getElementById('map');

            const mapOptions = {
                center: coords,
                level: 3,
            };

            const map = new window.kakao.maps.Map(container, mapOptions);
            map.setCenter(coords);

            // 마커가 표시될 위치
            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

            // 마커를 생성
            const marker = new window.kakao.maps.Marker({
                position: markerPosition
            });

            // 마커가 지도 위에 표시되도록 설정
            marker.setMap(map);
        });
    };

    return (
        <>
            {/* Kakao Maps API 스크립트 로드 */}
            <Script
                strategy="afterInteractive"
                type="text/javascript"
                src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=d023d1464e432f1c931e2527064cb25b&autoload=false`}
                onReady={loadKakaoMap} // 스크립트 로드 완료 시 로그 출력
            />
            {/* 지도가 표시될 div 요소 */}
            <div id="map" style={{ width: "100%", height: "400px" }} />
        </>
    );
}

