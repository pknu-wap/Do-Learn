package com.wap.web1.dto;

import lombok.Builder;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class WeeklyGoalDto {
    private Long goalId;
    private Long studyGroupId;
    private Long weeklyPeriodId;
    private LocalDate startDate;
    private LocalDate endDate;
    private DayOfWeek startDayOfWeek;
    private String mainCategory;
    private boolean deleted;
    private List<WeeklySubGoalDto> subGoals;
}
