package com.wap.web1.service;

import com.wap.web1.domain.*;
import com.wap.web1.dto.WeeklyGoalCompletionResponse;
import com.wap.web1.dto.WeeklyPlanRequest;
import com.wap.web1.dto.WeeklyPlanResponse;
import com.wap.web1.repository.PersonalTaskRepository;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.repository.WeeklyPeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalTaskService {

    private static final ZoneId KST_ZONE = ZoneId.of("Asia/Seoul");

    private final PersonalTaskRepository personalTaskRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final WeeklyPeriodRepository weeklyPeriodRepository;

    @Transactional
    public WeeklyPlanResponse createOrUpdateTasks(User user, Long groupId, List<WeeklyPlanRequest.PersonalTaskPlan> requests) {
        StudyMember member = getStudyMember(user, groupId);
        List<PersonalTask> savedTasks = new ArrayList<>();

        for (WeeklyPlanRequest.PersonalTaskPlan req : requests) {
            LocalDate kstDate = toKstLocalDate(req.getDate());

            WeeklyPeriod weeklyPeriod = findWeeklyPeriod(groupId, kstDate);

            PersonalTask task = req.getId() != null
                    ? personalTaskRepository.findByIdAndStudyMemberAndDeletedFalse(req.getId(),member).orElse(null)
                    : null;

            if (req.isDeleted()) {
                if (task != null) {
                    task.setDeleted(true);
                    personalTaskRepository.save(task);
                    savedTasks.add(task);
                }
                continue;
            }

            if (task == null) {
                task = new PersonalTask();
                task.setStudyMember(member);
            }

            task.setDate(kstDate);
            task.setDayofWeek(req.getDayOfWeek());
            task.setContent(req.getContent());
            task.setCompleted(req.isCompleted());
            task.setDeleted(false);
            task.setWeeklyPeriod(weeklyPeriod);

            PersonalTask saved = personalTaskRepository.save(task);
            savedTasks.add(saved);
        }

        return WeeklyPlanResponse.from(List.of(), savedTasks); // Member plan은 없으므로 빈 리스트 전달
    }

    @Transactional(readOnly = true)
    public List<PersonalTask> getTasks(User user, Long groupId, LocalDate referenceDate) {
        StudyMember member = getStudyMember(user, groupId);
        LocalDate kstDate = toKstLocalDate(referenceDate);
        WeeklyPeriod period = findWeeklyPeriod(groupId, kstDate);

        return personalTaskRepository.findAllByStudyMemberAndWeeklyPeriodAndDeletedFalse(member, period);
    }

    @Transactional
    public WeeklyGoalCompletionResponse updateCompletion(User user, Long taskId, boolean completed) {
        PersonalTask task = personalTaskRepository.findByIdAndDeletedFalse(taskId)
                .orElseThrow(() -> new IllegalArgumentException("과제를 찾을 수 없습니다."));

        if (!task.getStudyMember().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("다른 사용자의 과제를 수정할 수 없습니다.");
        }

        if (task.isCompleted() == completed) {
            return new WeeklyGoalCompletionResponse(
                    task.isCompleted(),
                    "변경 사항이 없습니다."
            );
        }

        // 이전 상태 저장 및 완료 여부 수정
        task.setLastCompletedStatus(task.isCompleted());
        task.setCompleted(completed);
        task.setLastModifiedAt(ZonedDateTime.now(KST_ZONE).toLocalDateTime());

        personalTaskRepository.save(task);

        return new WeeklyGoalCompletionResponse(
                task.isCompleted(),
                completed ? "과제가 완료되었습니다." : "과제 완료 상태가 취소되었습니다."
        );
    }

    private WeeklyPeriod findWeeklyPeriod(Long groupId, LocalDate date) {
        return weeklyPeriodRepository.findPeriodByGroupAndDate(groupId, date)
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜에 유효한 주차가 없습니다."));
    }

    private StudyMember getStudyMember(User user, Long groupId) {
        StudyGroup group = new StudyGroup();
        group.setId(groupId);
        return studyMemberRepository.findByStudyGroupAndUser(group, user)
                .orElseThrow(() -> new IllegalArgumentException("스터디 멤버를 찾을 수 없습니다."));
    }

    private LocalDate toKstLocalDate(LocalDate clientDate) {
        return clientDate.atStartOfDay(KST_ZONE).toLocalDate();
    }
}
