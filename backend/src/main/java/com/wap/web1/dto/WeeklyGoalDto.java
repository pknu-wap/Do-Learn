package com.wap.web1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
