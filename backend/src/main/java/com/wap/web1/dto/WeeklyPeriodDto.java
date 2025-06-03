package com.wap.web1.dto;

import lombok.Builder;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Data
@Builder
public class WeeklyPeriodDto {
    private Long weeklyPeriodId;
    private LocalDate startDate;
    private LocalDate endDate;
    private DayOfWeek startDayOfWeek;
}
