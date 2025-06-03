package com.wap.web1.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class WeeklyPlanRequest {
    private List<MemberGoalPlan> memberGoalPlans;
    private List<PersonalTaskPlan> personalTaskPlans;

    @Getter
    @Setter
    public static class MemberGoalPlan {
        private Long id;
        private Long subGoalId;
        private DayOfWeek dayOfWeek;
        private LocalDate date;
        private boolean completed;
        private boolean deleted;
    }

    @Getter
    @Setter
    public static class PersonalTaskPlan {
        private Long id;
        private String content;
        private DayOfWeek dayOfWeek;
        private LocalDate date;
        private boolean completed;
        private boolean deleted;
    }
}
