"use client";

// 필요한 훅을 임포트합니다.
/*global kakao*/
import Script from "next/script";
import { useLocationStore } from "@/stores/location";
import React from "react";

declare global {
    interface Window {
        kakao: any;
    }
}

// KakaoMap 컴포넌트 정의
export default function KakaoMap({
    latitudeLocal,
    longitudeLocal,
}: {
    latitudeLocal: number;
    longitudeLocal: number;
}) {
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
            const coords = new window.kakao.maps.LatLng(
                latitudeLocal,
                longitudeLocal
            );

            // 지도를 담을 영역의 DOM 레퍼런스
            const container = document.getElementById("map");

            const mapOptions = {
                center: coords,
                level: 9,
            };

            const map = new window.kakao.maps.Map(container, mapOptions);
            map.setCenter(coords);

            // 마커 클러스터러 생성
            const markerClusterer = new window.kakao.maps.MarkerClusterer({
                map: map,
                averageCenter: true,
                minLevel: 5,
            });

            // 마커가 표시될 위치
            const markerPosition = new window.kakao.maps.LatLng(
                latitudeLocal,
                longitudeLocal
            );

            // 마커를 생성
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
            });

            // 마커가 지도 위에 표시되도록 설정
            marker.setMap(map);

            // 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
            let debounceTimer: NodeJS.Timeout;

            window.kakao.maps.event.addListener(
                map,
                "center_changed",
                function () {
                    clearTimeout(debounceTimer); // 이전 타이머 클리어

                    debounceTimer = setTimeout(() => {
                        // 지도의 중심좌표를 얻어옵니다
                        const latlng = map.getCenter();

                        marker.setPosition(
                            new window.kakao.maps.LatLng(
                                latlng.getLat(),
                                latlng.getLng()
                            )
                        );
                        setLocation(
                            "address",
                            latlng.getLat(),
                            latlng.getLng()
                        );

                        // 10km 이내의 구인 게시물 가져오기
                        fetch(
                            `/api/get_post_list_by_location?latitude=${latlng.getLat()}&longitude=${latlng.getLng()}`
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                console.log(
                                    "10km 이내의 구인 게시물:",
                                    data.jobPostings
                                );

                                // 마커 클러스터에 마커 추가
                                const markers = data.jobPostings.map((job: any) => {
                                    const position =
                                        new window.kakao.maps.LatLng(
                                            job.location.latitude,
                                            job.location.longitude
                                        );
                                    const marker = new window.kakao.maps.Marker(
                                        {
                                            position: position,
                                            title: job.title,
                                        }
                                    );

                                    // 인포윈도우 생성
                                    const infowindow =
                                        new window.kakao.maps.InfoWindow({
                                            content: `<a href="http://localhost:3000/job_feed/${job.id}" style="color:blue"><div style="height: 50px; padding:5px;">${job.title}</div></a>`, // 인포윈도우에 표시할 내용
                                            removable: true, // 인포윈도우를 닫을 수 있는 x버튼 표시
                                        });

                                    // 마커 클릭 이벤트 추가
                                    window.kakao.maps.event.addListener(
                                        marker,
                                        "click",
                                        () => {
                                            infowindow.open(map, marker); // 마커 클릭 시 인포윈도우 열기
                                        }
                                    );

                                    window.kakao.maps.event.addListener(
                                        map,
                                        "center_changed",
                                        function () {
                                            infowindow.close();
                                        }
                                    );
                                    return marker;
                                });
                                markerClusterer.clear();
                                // 클러스터에 마커 추가
                                markerClusterer.addMarkers(markers);
                            })
                            .catch((error) =>
                                console.error(
                                    "Error fetching job postings:",
                                    error
                                )
                            );
                    }, 200); // 200ms 후에 실행
                }
            );
        });
    };

    return (
        <>
            {/* Kakao Maps API 스크립트 로드 */}
            <Script
                strategy="afterInteractive"
                type="text/javascript"
                src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=d023d1464e432f1c931e2527064cb25b&autoload=false&libraries=clusterer`}
                onReady={loadKakaoMap} // 스크립트 로드 완료 시 로그 출력
            />
            {/* 지도가 표시될 div 요소 */}
            <div id="map" style={{ width: "100%", height: "400px" }} />
        </>
    );
}
