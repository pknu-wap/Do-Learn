package com.wap.web1.repository;

import com.wap.web1.domain.MemberWeeklyPlan;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.dto.MemberRankingDto;
import com.wap.web1.dto.StudyRankDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface MemberWeeklyPlanRepositoryCustom {
    List<MemberWeeklyPlan> findAllByMemberAndWeeklyGoalId(StudyMember member, Long weeklyGoalId);
    List<Long> findCompletedSubGoalIdsByMemberAndWeeklyGoalId(Long memberId, Long weeklyGoalId);
    List<MemberRankingDto> getWeeklyRankingForGroup(Long studyGroupId, LocalDate startDate, LocalDate endDate);
    Map<Long, Long> countCompletedByMemberIdsAndPeriod(List<Long> memberIds, Long weeklyPeriodId);
    Long countCompletedByMemberIdAndPeriod(Long memberId, Long weeklyPeriodId);
}
