package com.wap.web1.service;

import com.wap.web1.domain.*;
import com.wap.web1.dto.WeeklyPlanRequest;
import com.wap.web1.dto.WeeklyPlanResponse;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.repository.WeeklyPeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class WeeklyPlanService {

    private static final ZoneId KST_ZONE = ZoneId.of("Asia/Seoul");

    private final MemberWeeklyPlanService memberPlanService;
    private final PersonalTaskService personalTaskService;
    private final StudyMemberRepository studyMemberRepository;
    private final WeeklyPeriodRepository weeklyPeriodRepository;

    @Transactional
    public WeeklyPlanResponse createOrUpdatePlans(User user, Long groupId, WeeklyPlanRequest request) {

        LocalDate referenceDate = extractReferenceDate(request);

        WeeklyPlanResponse memberResponse = memberPlanService.createOrUpdatePlans(user, groupId, request.getMemberGoalPlans());
        WeeklyPlanResponse taskResponse = personalTaskService.createOrUpdateTasks(user, groupId, request.getPersonalTaskPlans());

        return getWeeklyPlans(user, groupId, referenceDate);
    }

    @Transactional(readOnly = true)
    public WeeklyPlanResponse getWeeklyPlans(User user, Long groupId, LocalDate referenceDate) {
        return WeeklyPlanResponse.from(
                memberPlanService.getPlans(user, groupId, referenceDate),
                personalTaskService.getTasks(user, groupId, referenceDate)
        );
    }

    private WeeklyPeriod findWeeklyPeriod(Long groupId, LocalDate date) {
        return weeklyPeriodRepository
                .findPeriodByGroupAndDate(groupId, date)
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜에 유효한 주차가 존재하지 않습니다."));
    }

    private LocalDate extractReferenceDate(WeeklyPlanRequest request) {
        if (!request.getMemberGoalPlans().isEmpty()) {
            return request.getMemberGoalPlans().get(0).getDate();
        }
        if (!request.getPersonalTaskPlans().isEmpty()) {
            return request.getPersonalTaskPlans().get(0).getDate();
        }
        throw new IllegalArgumentException("요청에 날짜 정보가 없습니다.");
    }

    private StudyMember getStudyMember(User user, Long groupId) {
        return studyMemberRepository.findByUserIdAndStudyGroupId(user.getId(), groupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디 멤버를 찾을 수 없습니다."));
    }

    private LocalDate toKstLocalDate(LocalDate clientDate) {
        return clientDate.atStartOfDay(KST_ZONE).toLocalDate();
    }
}
