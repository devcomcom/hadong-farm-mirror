"use client";

import React, { useState } from "react";
// UI 컴포넌트 임포트
import { DateRangePicker, DateRange } from "@/components/common/date_range_picker";
// import { LocationFilter } from "@/components/ui/location-filter";
import { Input } from "@/components/ui/input";

interface FilterSectionProps {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ dateRange, setDateRange }) => {
    // const [location, setLocation] = useState<{ latitude: number; longitude: number; radius: number } | null>(null);
    const [keyword, setKeyword] = useState<string>("");

    return (
        <div className="flex gap-2 items-center">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            {/* <LocationFilter value={location} onChange={(loc) => setLocation(loc)} /> */}
            <Input
                type="text"
                placeholder="검색어 입력"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    );
};

export default FilterSection; 