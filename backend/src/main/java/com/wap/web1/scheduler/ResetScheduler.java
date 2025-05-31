package com.wap.web1.scheduler;

import com.wap.web1.domain.*;
import com.wap.web1.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResetScheduler {

    private final MemberWeeklyPlanRepository memberWeeklyPlanRepository;
    private final PersonalTaskRepository personalTaskRepository;
    private final WeeklyGoalRepository weeklyGoalRepository;
    private final WeeklySubGoalRepository weeklySubGoalRepository;
    private final WeeklyPeriodRepository weeklyPeriodRepository;
    private final StudyMemberRepository studyMemberRepository;

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void resetWeeklyData() {
        LocalDate today = LocalDate.now();

        List<WeeklyPeriod> endingThisWeek = weeklyPeriodRepository.findAllByEndDate(today);

        for (WeeklyPeriod period : endingThisWeek) {
            Long groupId = period.getStudyGroup().getId();

            log.info("[리셋 시작] 그룹 ID: {}, 주차: {} ~ {}", groupId, period.getStartDate(), period.getEndDate());

            // 1. MemberWeeklyPlan 삭제
            List<MemberWeeklyPlan> memberPlans = memberWeeklyPlanRepository.findAllByWeeklyPeriod(period);
            memberWeeklyPlanRepository.deleteAll(memberPlans);

            // 2. PersonalTask 삭제
            List<PersonalTask> personalTasks = personalTaskRepository.findAllByWeeklyPeriod(period);
            personalTaskRepository.deleteAll(personalTasks);

            // 3. WeeklyGoal 및 SubGoal 삭제
            List<WeeklyGoal> weeklyGoals = weeklyGoalRepository.findByWeeklyPeriod(period);
            for (WeeklyGoal goal : weeklyGoals) {
                List<WeeklySubGoal> subGoals = weeklySubGoalRepository.findByWeeklyGoalId(goal.getId());
                weeklySubGoalRepository.deleteAll(subGoals);
            }
            weeklyGoalRepository.deleteAll(weeklyGoals);

            log.info("[리셋 완료] 그룹 ID: {}, 주차: {} ~ {}", groupId, period.getStartDate(), period.getEndDate());
        }
    }


    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void resetProgressForEndedPeriods() {
        ZoneId kst = ZoneId.of("Asia/Seoul");
        LocalDate today = ZonedDateTime.now(kst).toLocalDate();

        List<WeeklyPeriod> endedPeriods = weeklyPeriodRepository.findAllByEndDate(today.minusDays(1));

        if(endedPeriods.isEmpty()) return;

        for(WeeklyPeriod period : endedPeriods) {
            List<StudyMember> members = studyMemberRepository.findByStudyGroupId(period.getStudyGroup().getId());
            for(StudyMember member : members) {
                member.setProgress(0);
            }
            studyMemberRepository.saveAll(members);
            log.info("Reset progress for group {}, period {} ~ {}",
                    period.getStudyGroup().getId(),period.getStartDate(),period.getEndDate());
        }
    }
}
