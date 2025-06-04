package com.wap.web1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklySubGoalDto {
    private Long id;
    private String content;
    private boolean deleted;
}
