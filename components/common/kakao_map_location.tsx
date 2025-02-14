"use client";

// 필요한 훅을 임포트합니다.
/*global kakao*/
import Script from "next/script";
import { useLocationStore } from "@/stores/location";
import { useEffect, useState } from "react";
declare global {
    interface Window {
        kakao: any;
    }
}

// KakaoMap 컴포넌트 정의
export default function KakaoMap({ latitudeLocal, longitudeLocal }: { latitudeLocal: number; longitudeLocal: number }) {
    const { setLocation } = useLocationStore();
    const [address, setAddress] = useState('');
    const [map, setMap] = useState<window.kakao.maps.Map | null>(null);
    const [marker, setMarker] = useState<window.kakao.maps.Marker | null>(null);
    const [geocoder, setGeocoder] = useState<window.kakao.maps.services.Geocoder | null>(null);
    // 주소를 위경도로 변환하는 함수
    const getCoordinates = (address: string) => {
        if (!geocoder) {
            console.error("Geocoder is not initialized.");
            return;
        }
        geocoder.addressSearch(address, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const { x, y } = result[0]; // 경도, 위도
                console.log('x, y', x, y);
                setLocation(address, parseFloat(y).toFixed(6), parseFloat(x).toFixed(6)); // 상태 업데이트

                map?.setCenter(new window.kakao.maps.LatLng(parseFloat(y), parseFloat(x)));

                marker?.setPosition(new window.kakao.maps.LatLng(parseFloat(y), parseFloat(x)));
            } else {
                alert("주소를 찾을 수 없습니다.");
            }
        });
    };

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

            setMap(map);

            const marker = new window.kakao.maps.Marker({
                position: coords
            });
            marker.setMap(map);

            const geocoder = new window.kakao.maps.services.Geocoder();
            setGeocoder(geocoder);
            setMarker(marker);
        });
    };

    useEffect(() => {
        const address = useLocationStore.getState().address; // 현재 주소 가져오기
        if (address) {
            getCoordinates(address);
        }
    }, [useLocationStore((state) => state.address)]);

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

