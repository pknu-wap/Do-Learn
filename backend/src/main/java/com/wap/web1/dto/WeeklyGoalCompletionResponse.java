package com.wap.web1.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WeeklyGoalCompletionResponse {
    private boolean completed;
    private String message;
}
