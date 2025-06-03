package com.wap.web1.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeeklyProgressDto {
    private Long studyMemberId;
    private Long weeklyPeriodId;
    private int completedSubGoals;
    private int totalSubGoals;
    private double progressRate;
    private String nickname;
}
