package com.wap.web1.service;

import com.wap.web1.domain.*;
import com.wap.web1.dto.WeeklyGoalCompletionResponse;
import com.wap.web1.dto.WeeklyPlanRequest;
import com.wap.web1.dto.WeeklyPlanResponse;
import com.wap.web1.repository.MemberWeeklyPlanRepository;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.repository.WeeklyPeriodRepository;
import com.wap.web1.repository.WeeklySubGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberWeeklyPlanService {

    private static final ZoneId KST_ZONE = ZoneId.of("Asia/Seoul");

    private final MemberWeeklyPlanRepository memberWeeklyPlanRepository;
    private final WeeklySubGoalRepository subGoalRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final WeeklyPeriodRepository weeklyPeriodRepository;
    private final ProgressService progressService;

    @Transactional
    public WeeklyPlanResponse createOrUpdatePlans(User user, Long groupId, List<WeeklyPlanRequest.MemberGoalPlan> requests) {
        StudyMember member = getStudyMember(user, groupId);

        if (requests.isEmpty()) {
            return WeeklyPlanResponse.from(List.of(), List.of());
        }

        LocalDate referenceDate = toKstLocalDate(requests.get(0).getDate());

        WeeklyPeriod weeklyPeriod = findWeeklyPeriod(groupId, referenceDate);

        List<WeeklySubGoal> validSubGoals = subGoalRepository.findSubGoalsByGroupAndWeeklyPeriodId(groupId, weeklyPeriod.getId());
        Map<Long, WeeklySubGoal> validSubGoalMap = validSubGoals.stream()
                .collect(Collectors.toMap(WeeklySubGoal::getId, sg -> sg));

        List<MemberWeeklyPlan> savedPlans = new ArrayList<>();

        for (WeeklyPlanRequest.MemberGoalPlan req : requests) {
            WeeklySubGoal subGoal = validSubGoalMap.get(req.getSubGoalId());
            if (subGoal == null) {
                throw new IllegalArgumentException("해당 소목표는 현재 주차에 속하지 않습니다. subGoalId=" + req.getSubGoalId());
            }

            MemberWeeklyPlan plan = (req.getId() != null)
                    ? memberWeeklyPlanRepository.findByIdAndStudyMemberAndDeletedFalse(req.getId(), member).orElse(null)
                    : null;

            if (req.isDeleted()) {
                if (plan != null) {
                    plan.delete();
                    savedPlans.add(memberWeeklyPlanRepository.save(plan));
                }
                continue;
            }

            LocalDate kstDate = toKstLocalDate(req.getDate());

            if (plan == null) {
                plan = MemberWeeklyPlan.create(member, subGoal, weeklyPeriod, req.getDate(), req.getDayOfWeek(), req.isCompleted());
            } else {
                plan.setDate(kstDate);
                plan.setDayofWeek(req.getDayOfWeek());
                plan.setCompleted(req.isCompleted());
                plan.setDeleted(false);
                plan.setWeeklyPeriod(weeklyPeriod);
            }

            savedPlans.add(memberWeeklyPlanRepository.save(plan));
        }

        return WeeklyPlanResponse.from(savedPlans, List.of());
    }

    @Transactional
    public WeeklyGoalCompletionResponse updateCompletion(User user, Long planId, boolean completed) {
        MemberWeeklyPlan plan = memberWeeklyPlanRepository.findByIdAndDeletedFalse(planId)
                .orElseThrow(() -> new IllegalArgumentException("계획을 찾을 수 없습니다."));

        StudyMember member = getStudyMember(user, plan.getStudyMember().getStudyGroup().getId());

        if (!plan.isOwnedBy(member)) {
            throw new IllegalArgumentException("다른 사용자의 계획을 수정할 수 없습니다.");
        }

        if (plan.isCompleted() == completed) {
            return new WeeklyGoalCompletionResponse(plan.isWeeklyGoalCompleted(), "변경 사항이 없습니다.");
        }

        LocalDateTime now = ZonedDateTime.now(KST_ZONE).toLocalDateTime();
        plan.markCompleted(completed, now);
        memberWeeklyPlanRepository.save(plan);

        // 진행도 업데이트
        progressService.updateProgressRate(member, plan.getWeeklyPeriod());

        return autoCompleteWeeklyGoal(member, plan.getWeeklySubGoal().getWeeklyGoal().getId(), now, completed);
    }

    @Transactional(readOnly = true)
    public List<MemberWeeklyPlan> getPlans(User user, Long groupId, LocalDate referenceDate) {
        StudyMember member = getStudyMember(user, groupId);
        LocalDate kstDate = toKstLocalDate(referenceDate);
        WeeklyPeriod period = findWeeklyPeriod(groupId, kstDate);

        return memberWeeklyPlanRepository.findAllByStudyMemberAndWeeklyPeriodAndDeletedFalse(member, period);
    }

    private WeeklyGoalCompletionResponse autoCompleteWeeklyGoal(StudyMember member, Long weeklyGoalId, LocalDateTime now, boolean justCompleted) {
        List<Long> subGoalIds = subGoalRepository.findIdsByWeeklyGoalIdAndDeletedFalse(weeklyGoalId);

        List<Long> completedSubGoalIds = memberWeeklyPlanRepository
                .findCompletedSubGoalIdsByMemberAndWeeklyGoalId(member.getId(), weeklyGoalId);

        boolean allCompleted = !subGoalIds.isEmpty() && completedSubGoalIds.containsAll(subGoalIds);

        List<MemberWeeklyPlan> relatedPlans = memberWeeklyPlanRepository.findAllByMemberAndWeeklyGoalId(member, weeklyGoalId);

        if (allCompleted) {
            relatedPlans.forEach(plan -> plan.markWeeklyGoalCompleted(now));
            memberWeeklyPlanRepository.saveAll(relatedPlans);
            return new WeeklyGoalCompletionResponse(true, "대범주가 정상적으로 완료 처리되었습니다.");
        } else {
            relatedPlans.forEach(MemberWeeklyPlan::unmarkWeeklyGoalCompleted);
            memberWeeklyPlanRepository.saveAll(relatedPlans);
            return new WeeklyGoalCompletionResponse(false, justCompleted ? "일부 소목표가 아직 완료되지 않았습니다." : "대범주 완료 상태가 해제되었습니다.");
        }
    }

    private WeeklyPeriod findWeeklyPeriod(Long groupId, LocalDate date) {
        return weeklyPeriodRepository.findPeriodByGroupAndDate(groupId, date)
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜에 유효한 주차가 없습니다."));
    }

    private StudyMember getStudyMember(User user, Long groupId) {
        return studyMemberRepository.findByUserIdAndStudyGroupId(user.getId(), groupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디 멤버를 찾을 수 없습니다."));
    }

    private LocalDate toKstLocalDate(LocalDate clientDate) {
        return clientDate.atStartOfDay(KST_ZONE).toLocalDate();
    }
}
