package com.wap.web1.mapper;

import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.WeeklyGoal;
import com.wap.web1.domain.WeeklyPeriod;
import com.wap.web1.domain.WeeklySubGoal;
import com.wap.web1.dto.WeeklyGoalDto;
import com.wap.web1.dto.WeeklySubGoalDto;

import java.util.List;
import java.util.stream.Collectors;

public class WeeklyGoalMapper {

    public static WeeklyGoalDto toDto(WeeklyGoal goal, List<WeeklySubGoal> subGoals) {
        return WeeklyGoalDto.builder()
                .goalId(goal.getId())
                .studyGroupId(goal.getStudyGroup().getId())
                .weeklyPeriodId(goal.getWeeklyPeriod().getId())
                .startDate(goal.getWeeklyPeriod().getStartDate())
                .endDate(goal.getWeeklyPeriod().getEndDate())
                .mainCategory(goal.getMainCategory())
                .deleted(goal.isDeleted())
                .subGoals(subGoals.stream()
                        .map(WeeklyGoalMapper::toDto)
                        .collect(Collectors.toList()))
                .build();
    }

    public static WeeklyGoal toEntity(WeeklyGoalDto dto, StudyGroup group, WeeklyPeriod period) {
        return WeeklyGoal.builder()
                .studyGroup(group)
                .weeklyPeriod(period)
                .mainCategory(dto.getMainCategory())
                .deleted(false)
                .build();
    }

    public static WeeklySubGoal toEntity(WeeklySubGoalDto dto, WeeklyGoal goal) {
        return WeeklySubGoal.builder()
                .weeklyGoal(goal)
                .content(dto.getContent())
                .deleted(Boolean.TRUE.equals(dto.isDeleted()))
                .build();
    }

    public static WeeklySubGoalDto toDto(WeeklySubGoal subGoal) {
        return WeeklySubGoalDto.builder()
                .id(subGoal.getId())
                .content(subGoal.getContent())
                .deleted(subGoal.isDeleted())
                .build();
    }
}

