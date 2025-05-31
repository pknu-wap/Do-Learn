package com.wap.web1.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeeklySubGoalDto {
    private Long id;
    private String content;
    private boolean deleted;
}
