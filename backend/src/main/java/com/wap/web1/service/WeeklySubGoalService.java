package com.wap.web1.service;

import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.User;
import com.wap.web1.domain.WeeklyGoal;
import com.wap.web1.domain.WeeklySubGoal;
import com.wap.web1.dto.WeeklySubGoalDto;
import com.wap.web1.repository.StudyGroupRepository;
import com.wap.web1.repository.WeeklyGoalRepository;
import com.wap.web1.repository.WeeklySubGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class WeeklySubGoalService {

    private final WeeklyGoalRepository weeklyGoalRepository;
    private final WeeklySubGoalRepository subGoalRepository;
    private final StudyGroupRepository studyGroupRepository;

    @Transactional
    public void createSubGoal(Long goalId, WeeklySubGoalDto dto, User currentUser) {
        WeeklyGoal goal = weeklyGoalRepository.findByIdAndDeletedFalse(goalId)
                .orElseThrow(()-> new RuntimeException("공통 목표 없음"));

        validateIsLeader(currentUser,goal.getStudyGroup().getId());

        WeeklySubGoal newSubGoal = WeeklySubGoal.builder()
                .weeklyGoal(goal)
                .content(dto.getContent())
                .deleted(false)
                .build();

        subGoalRepository.save(newSubGoal);
    }

    @Transactional
    public void updateSubGoal(Long subGoalId, WeeklySubGoalDto dto, User currentUser) {
        WeeklySubGoal existing = subGoalRepository.findById(subGoalId)
                .orElseThrow(()-> new RuntimeException("소범주 없음"));

        WeeklyGoal goal = existing.getWeeklyGoal();
        validateIsLeader(currentUser,goal.getStudyGroup().getId());

        if(dto.getContent() != null) {
            existing.setContent(dto.getContent());
        }

        subGoalRepository.save(existing);
    }

    @Transactional
    public void deleteSubGoal(Long subGoalId, User currentUser) {
        WeeklySubGoal existing = subGoalRepository.findById(subGoalId)
                .orElseThrow(() -> new RuntimeException("소범주 없음"));

        WeeklyGoal goal = existing.getWeeklyGoal();
        validateIsLeader(currentUser,goal.getStudyGroup().getId());

        if(existing.isDeleted()) {
            throw new IllegalStateException("이미 삭제된 소범주입니다.");
        }

        existing.setDeleted(true);
        subGoalRepository.save(existing);
    }

    private void validateIsLeader(User user, Long studyGroupId) {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(()-> new RuntimeException("스터디 그룹 없음"));

        if(!group.getLeader().getId().equals(user.getId())) {
            throw new RuntimeException("리더만 접근할 수 있습니다.");
        }
    }
}
