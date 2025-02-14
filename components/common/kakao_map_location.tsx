"use client";

// 필요한 훅을 임포트합니다.
/*global kakao*/
import Script from "next/script";
import { useLocationStore } from "@/stores/location";

declare global {
    interface Window {
        kakao: any;
    }
}

// KakaoMap 컴포넌트 정의
export default function KakaoMap({ latitudeLocal, longitudeLocal }: { latitudeLocal: number; longitudeLocal: number }) {
    const { setLocation } = useLocationStore();
    // 카카오 맵 API 로드
    const loadKakaoMap = () => {
        if (!window.kakao) {
            console.error("Kakao Map API is not loaded.");
            return;
        }

        //33.5563, 126.79581
        window.kakao.maps.load(() => {
            // 결과값 위치 좌표
            const coords = new window.kakao.maps.LatLng(latitudeLocal, longitudeLocal);

            // 지도를 담을 영역의 DOM 레퍼런스
            const container = document.getElementById('map');

            const mapOptions = {
                center: coords,
                level: 3,
            };

            const map = new window.kakao.maps.Map(container, mapOptions);
            map.setCenter(coords);

            // 마커가 표시될 위치
            const markerPosition = new window.kakao.maps.LatLng(latitudeLocal, longitudeLocal);

            // 마커를 생성
            const marker = new window.kakao.maps.Marker({
                position: markerPosition
            });

            // 좌표를 주소로 변환하는 객체를 변수에 대입
            const geocoder = new window.kakao.maps.services.Geocoder();

            console.log('geocoder', geocoder);

            // 마커가 지도 위에 표시되도록 설정
            marker.setMap(map);

            // 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
            let timeout: NodeJS.Timeout | null = null; // 쓰로틀링을 위한 타이머 변수

            window.kakao.maps.event.addListener(map, 'center_changed', async function () {
                if (timeout) {
                    clearTimeout(timeout); // 이전 타이머 클리어
                }

                timeout = setTimeout(async () => {
                    // 지도의 중심좌표를 얻어옵니다 
                    const latlng = map.getCenter();

                    marker.setPosition(new window.kakao.maps.LatLng(latlng.getLat(), latlng.getLng()));

                    await geocoder.coord2RegionCode(latlng.getLng(), latlng.getLat(), (result: any, status: any) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            setLocation(result[0].address_name, latlng.getLat(), latlng.getLng());
                        }
                    });
                }, 200); // 200ms 후에 실행
            });
        });
    };

    return (
        <>
            {/* Kakao Maps API 스크립트 로드 */}
            <Script
                strategy="afterInteractive"
                type="text/javascript"
                src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=d023d1464e432f1c931e2527064cb25b&libraries=services&autoload=false`}
                onReady={loadKakaoMap} // 스크립트 로드 완료 시 로그 출력
            />
            {/* 지도가 표시될 div 요소 */}
            <div id="map" style={{ width: "100%", height: "400px" }} />
        </>
    );
}

