"use client";

import React from "react";

const LoadingCard: React.FC = () => {
    return (
        <div className="p-4 border rounded shadow animate-pulse">
            {/* 제목 영역 */}
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
            {/* 내용 영역 */}
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
    );
};

export default LoadingCard; 