package com.wap.web1.service;

import com.wap.web1.domain.MemberWeeklyPlan;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.WeeklyPeriod;
import com.wap.web1.dto.WeeklyProgressDto;
import com.wap.web1.repository.MemberWeeklyPlanRepository;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.repository.WeeklyPeriodRepository;
import com.wap.web1.repository.WeeklySubGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final MemberWeeklyPlanRepository memberWeeklyPlanRepository;
    private final WeeklyPeriodRepository weeklyPeriodRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final WeeklySubGoalRepository weeklySubGoalRepository;

    @Transactional(readOnly = true)
    public List<WeeklyProgressDto> getWeeklyProgress(Long studyGroupId, LocalDate referenceDate) {

        WeeklyPeriod weeklyPeriod = weeklyPeriodRepository.findPeriodByGroupAndDate(studyGroupId, referenceDate)
                .orElseThrow(()->new IllegalArgumentException("해당 날짜에 대한 주차 정보가 없습니다."));

        Long weeklyPeriodId = weeklyPeriod.getId();
        List<StudyMember> members = studyMemberRepository.findByStudyGroupId(studyGroupId);

        if(members.isEmpty()) return Collections.emptyList();

        int totalSubGoals = weeklySubGoalRepository.countSubGoalsByGroupAndWeeklyPeriodId(studyGroupId,weeklyPeriodId);

        if(totalSubGoals == 0) {
            return members.stream()
                    .map(member -> WeeklyProgressDto.builder()
                            .studyMemberId(member.getId())
                            .weeklyPeriodId(weeklyPeriodId)
                            .completedSubGoals(0)
                            .totalSubGoals(0)
                            .progressRate(0.0)
                            .nickname(member.getUser().getNickname())
                            .build())
                    .collect(Collectors.toList());
        }

        Map<Long, Long> completedCounts = memberWeeklyPlanRepository.countCompletedByMemberIdsAndPeriod(
                members.stream().map(StudyMember::getId).toList(),
                weeklyPeriodId
        );

        return members.stream()
                .map(member ->{
                    Long completed = completedCounts.getOrDefault(member.getId(),0L);
                    double rate = (double) completed/totalSubGoals;

                    return WeeklyProgressDto.builder()
                            .studyMemberId(member.getId())
                            .weeklyPeriodId(weeklyPeriodId)
                            .completedSubGoals(completed.intValue())
                            .totalSubGoals(totalSubGoals)
                            .progressRate(rate)
                            .nickname(member.getUser().getNickname())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WeeklyProgressDto getMyWeeklyProgress(StudyMember member, LocalDate referenceDate) {
        Long studyGroupId = member.getStudyGroup().getId();

        WeeklyPeriod weeklyPeriod = weeklyPeriodRepository.findPeriodByGroupAndDate(studyGroupId, referenceDate)
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜에 대한 주차 정보가 없습니다."));

        Long weeklyPeriodId = weeklyPeriod.getId();

        int totalSubGoals = weeklySubGoalRepository.countSubGoalsByGroupAndWeeklyPeriodId(studyGroupId, weeklyPeriodId);

        if (totalSubGoals == 0) {
            return WeeklyProgressDto.builder()
                    .studyMemberId(member.getId())
                    .weeklyPeriodId(weeklyPeriodId)
                    .completedSubGoals(0)
                    .totalSubGoals(0)
                    .progressRate(0.0)
                    .nickname(member.getUser().getNickname())
                    .build();
        }

        Long completedCount = memberWeeklyPlanRepository.countCompletedByMemberIdAndPeriod(member.getId(), weeklyPeriodId);

        double rate = (double) completedCount / totalSubGoals;

        return WeeklyProgressDto.builder()
                .studyMemberId(member.getId())
                .weeklyPeriodId(weeklyPeriodId)
                .completedSubGoals(completedCount.intValue())
                .totalSubGoals(totalSubGoals)
                .progressRate(rate)
                .nickname(member.getUser().getNickname())
                .build();
    }


    @Transactional
    public void updateProgressRate(StudyMember member, WeeklyPeriod weeklyPeriod) {
        Long memberId = member.getId();
        Long weeklyPeriodId = weeklyPeriod.getId();

        int totalSubGoals = weeklySubGoalRepository.countSubGoalsByGroupAndWeeklyPeriodId(
                member.getStudyGroup().getId(), weeklyPeriodId
        );
        if(totalSubGoals == 0) {
            member.setProgress(0);
            return;
        }

        Long completedCount = memberWeeklyPlanRepository.countCompletedByMemberIdAndPeriod(
                memberId, weeklyPeriodId
        );

        double rate = (double) completedCount / totalSubGoals;
        member.setProgress((int) (rate * 100));
        studyMemberRepository.save(member);
    }
}
