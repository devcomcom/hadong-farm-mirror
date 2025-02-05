"use client";

import React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// 날짜 범위 타입 정의
export type DateRange = {
    start: Date | null;
    end: Date | null;
};

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    // 필요에 따라 추가적인 프롭스(예: 클래스명 등)를 정의할 수 있습니다.
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    value,
    onChange,
}) => {
    // 선택된 날짜 범위가 있다면 포맷팅하여 버튼에 표시
    const displayValue =
        value.start && value.end
            ? `${format(value.start, "yyyy.MM.dd", { locale: ko })} - ${format(value.end, "yyyy.MM.dd", { locale: ko })}`
            : "Pick a date range";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                >
                    {displayValue}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="range"
                    // react-day-picker의 range 모드는 선택값을 { from, to } 객체 형태로 기대합니다.
                    selected={value.start ? { from: value.start, to: value.end || undefined } : undefined}
                    // 기본으로 보여줄 달은 선택된 시작 날짜(또는 없을 경우 오늘 날짜)로 설정
                    defaultMonth={value.start || new Date()}
                    onSelect={(range) => {
                        if (!range) {
                            // 선택이 해제된 경우
                            onChange({ start: null, end: null });
                        } else {
                            // 항목 선택 시 from과 to 값을 업데이트 (to가 아직 선택되지 않을 경우 null)
                            onChange({ start: range.from || null, end: range.to || null });
                        }
                    }}
                />
            </PopoverContent>
        </Popover>
    );
};

export default DateRangePicker;