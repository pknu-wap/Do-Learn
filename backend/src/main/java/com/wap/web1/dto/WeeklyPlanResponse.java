package com.wap.web1.dto;

import com.wap.web1.domain.MemberWeeklyPlan;
import com.wap.web1.domain.PersonalTask;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class WeeklyPlanResponse {
    private List<MemberWeeklyPlanResponse> memberWeeklyPlans;
    private List<PersonalTaskResponse> personalTasks;

    @Getter
    @Setter
    public static class MemberWeeklyPlanResponse {
        private Long id;
        private String subGoalContent;
        private DayOfWeek dayOfWeek;
        private boolean completed;
        private LocalDate date;
    }

    @Getter
    @Setter
    public static class PersonalTaskResponse {
        private Long id;
        private String content;
        private DayOfWeek dayOfWeek;
        private boolean completed;
        private LocalDate date;
    }
    public static WeeklyPlanResponse from(List<MemberWeeklyPlan> memberPlans, List<PersonalTask> personalTasks) {
        WeeklyPlanResponse response = new WeeklyPlanResponse();

        List<MemberWeeklyPlanResponse> memberResponses = memberPlans.stream()
                .map(plan -> {
                    MemberWeeklyPlanResponse res = new MemberWeeklyPlanResponse();
                    res.setId(plan.getId());
                    res.setSubGoalContent(plan.getWeeklySubGoal().getContent());
                    res.setDayOfWeek(plan.getDayofWeek());
                    res.setCompleted(plan.isCompleted());
                    res.setDate(plan.getDate());
                    return res;
                })
                .collect(Collectors.toList());

        List<PersonalTaskResponse> personalResponses = personalTasks.stream()
                .map(task -> {
                    PersonalTaskResponse res = new PersonalTaskResponse();
                    res.setId(task.getId());
                    res.setContent(task.getContent());
                    res.setDayOfWeek(task.getDayofWeek());
                    res.setCompleted(task.isCompleted());
                    res.setDate(task.getDate());
                    return res;
                })
                .collect(Collectors.toList());

        response.setMemberWeeklyPlans(memberResponses);
        response.setPersonalTasks(personalResponses);
        return response;
    }
}
