package com.wap.web1.service;

import com.wap.web1.domain.*;
import com.wap.web1.dto.WeeklyGoalDto;
import com.wap.web1.dto.WeeklySubGoalDto;
import com.wap.web1.mapper.WeeklyGoalMapper;
import com.wap.web1.repository.*;
import com.wap.web1.util.WeeklyPeriodCalculator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeeklyGoalService {

    private final WeeklyGoalRepository weeklyGoalRepository;
    private final WeeklySubGoalRepository weeklySubGoalRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final WeeklyPeriodRepository weeklyPeriodRepository;

    //대범주 등록 (중복 방지 포함)
    @Transactional
    public WeeklyGoalDto createWeeklyGoal(WeeklyGoalDto dto, User currentUser) {
        validateIsLeader(currentUser, dto.getStudyGroupId());

        StudyGroup group = studyGroupRepository.findById(dto.getStudyGroupId())
                .orElseThrow(() -> new RuntimeException("스터디 그룹 없음"));

        if(!dto.getStartDate().getDayOfWeek().equals(dto.getStartDayOfWeek())) {
            throw new IllegalArgumentException("입력된 시작 날짜와 시작 요일이 일치하지 않습니다.");
        }

        WeeklyPeriodCalculator.WeeklyPeriodDateRange range =
                WeeklyPeriodCalculator.calculateWeeklyPeriod(dto.getStartDate(),dto.getStartDayOfWeek());

        // 주차 일치 여부 검사
        validateConsistentWeeklyPeriod(dto.getStudyGroupId(), range.getStartDate(), range.getEndDate(), null);

        // WeeklyPeriod가 있는지 확인하고 없으면 새로 생성
        WeeklyPeriod weeklyPeriod = findOrCreateWeeklyPeriod(
                range.getStartDate(), range.getEndDate(), group,dto.getStartDayOfWeek());

        validateNoDuplicateMainCategory(dto.getStudyGroupId(), weeklyPeriod.getStartDate(), weeklyPeriod.getEndDate(), dto.getMainCategory());

        WeeklyGoal goal = weeklyGoalRepository.save(
                WeeklyGoal.builder()
                        .studyGroup(group)
                        .weeklyPeriod(weeklyPeriod)
                        .mainCategory(dto.getMainCategory())
                        .deleted(false)
                        .build()
        );

        List<WeeklySubGoal> subGoals = createSubGoals(dto.getSubGoals(),goal);
        weeklySubGoalRepository.saveAll(subGoals);

        return WeeklyGoalMapper.toDto(goal, subGoals);
    }

    // 한 대범주 조회
    public WeeklyGoalDto getWeeklyGoal(Long goalId) {
        WeeklyGoal goal = weeklyGoalRepository.findByIdAndDeletedFalse(goalId)
                .orElseThrow(() -> new RuntimeException("공통 목표 없음"));

        List<WeeklySubGoal> subGoals = weeklySubGoalRepository.findByWeeklyGoalIdAndDeletedFalse(goalId);

        return WeeklyGoalMapper.toDto(goal, subGoals);
    }

    // 전체 대범주 조회
    public List<WeeklyGoalDto> getAllWeeklyGoals(Long studyGroupId, LocalDate referenceDate,DayOfWeek startDayOfWeek) {
        WeeklyPeriodCalculator.WeeklyPeriodDateRange range =
                WeeklyPeriodCalculator.calculateWeeklyPeriod(referenceDate, startDayOfWeek);
        LocalDate startDate = range.getStartDate();
        LocalDate endDate = range.getEndDate();

        List<WeeklyGoal> weeklyGoals = weeklyGoalRepository
                .findByStudyGroupIdAndWeeklyPeriodStartDateAndWeeklyPeriodEndDateAndDeletedFalse(studyGroupId,startDate,endDate);

        if(weeklyGoals.isEmpty()) {
            return List.of();
        }

        List<Long> goalIds = weeklyGoals.stream().map(WeeklyGoal::getId).toList();
        List<WeeklySubGoal> subGoals = weeklySubGoalRepository.findByWeeklyGoalIdInAndDeletedFalse(goalIds);

        Map<Long,List<WeeklySubGoal>> subGoalMap = subGoals.stream()
                .collect(Collectors.groupingBy(sg -> sg.getWeeklyGoal().getId()));

        return weeklyGoals.stream()
                .map(goal -> {
                    List<WeeklySubGoal> grouped = subGoalMap.getOrDefault(goal.getId(), List.of());
                    return WeeklyGoalMapper.toDto(goal,grouped);
                })
                .collect(Collectors.toList());
    }

    // 대범주 전체 수정
    @Transactional
    public WeeklyGoalDto updateWeeklyGoal(Long goalId, WeeklyGoalDto dto, User currentUser) {
        WeeklyGoal goal = weeklyGoalRepository.findByIdAndDeletedFalse(goalId)
                .orElseThrow(() -> new RuntimeException("공통 목표 없음"));

        validateIsLeader(currentUser, goal.getStudyGroup().getId());
        StudyGroup group = goal.getStudyGroup();

        WeeklyPeriodCalculator.WeeklyPeriodDateRange range =
                WeeklyPeriodCalculator.calculateWeeklyPeriod(dto.getStartDate(),dto.getStartDayOfWeek());

        validateConsistentWeeklyPeriod(group.getId(), range.getStartDate(), range.getEndDate(), goalId);

        WeeklyPeriod weeklyPeriod = findOrCreateWeeklyPeriod(
                range.getStartDate(), range.getEndDate(), group,dto.getStartDayOfWeek());

        goal.setWeeklyPeriod(weeklyPeriod);
        goal.setMainCategory(dto.getMainCategory());

        // 기존 소범주 delete
        List<WeeklySubGoal> oldSubGoals = weeklySubGoalRepository.findByWeeklyGoalIdAndDeletedFalse(goalId);
        oldSubGoals.forEach(sub -> sub.setDeleted(true));
        weeklySubGoalRepository.saveAll(oldSubGoals);

        List<WeeklySubGoal> newSubGoals = createSubGoals(dto.getSubGoals(),goal);
        weeklySubGoalRepository.saveAll(newSubGoals);

        return WeeklyGoalMapper.toDto(goal, newSubGoals);
    }

    //대범주 삭제
    @Transactional
    public void deleteWeeklyGoal(Long goalId, User currentUser) {
        WeeklyGoal goal = weeklyGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("공통 목표 없음"));

        validateIsLeader(currentUser, goal.getStudyGroup().getId());

        goal.setDeleted(true);

        List<WeeklySubGoal> subGoals = weeklySubGoalRepository.findByWeeklyGoalIdAndDeletedFalse(goalId);
        subGoals.forEach(sub -> sub.setDeleted(true));
        weeklySubGoalRepository.saveAll(subGoals);
    }

    private List<WeeklySubGoal> createSubGoals(List<WeeklySubGoalDto> dtos, WeeklyGoal goal) {
        return dtos.stream()
                .map(dto -> WeeklyGoalMapper.toEntity(dto,goal))
                .collect(Collectors.toList());
    }

    private void validateNoDuplicateMainCategory(Long studyGroupId, LocalDate startDate, LocalDate endDate, String mainCategory) {
        boolean exists = weeklyGoalRepository.existsByStudyGroupIdAndWeeklyPeriodStartDateAndWeeklyPeriodEndDateAndMainCategoryAndDeletedFalse(
                studyGroupId, startDate, endDate, mainCategory);
        if (exists) {
            throw new RuntimeException("이미 같은 주차에 동일한 대범주가 존재합니다.");
        }
    }

    private void validateConsistentWeeklyPeriod(Long studyGroupId, LocalDate startDate, LocalDate endDate, Long excludeGoalId) {
        boolean anyMismatch = weeklyGoalRepository
                .findByStudyGroupIdAndDeletedFalse(studyGroupId)
                .stream()
                .filter(goal -> excludeGoalId == null || !goal.getId().equals(excludeGoalId))
                .map(WeeklyGoal::getWeeklyPeriod)
                .anyMatch(period -> !period.getStartDate().equals(startDate) || !period.getEndDate().equals(endDate));

        if (anyMismatch) {
            throw new RuntimeException("같은 주차의 모든 목표는 동일한 시작일과 종료일을 가져야 합니다.");
        }
    }

    private WeeklyPeriod findOrCreateWeeklyPeriod(LocalDate startDate, LocalDate endDate, StudyGroup group, DayOfWeek startDayOfWeek) {
        return weeklyPeriodRepository
                .findByStudyGroupIdAndStartDateAndEndDate(group.getId(), startDate, endDate)
                .orElseGet(() -> {
                    WeeklyPeriod newPeriod = WeeklyPeriod.builder()
                            .studyGroup(group)
                            .startDate(startDate)
                            .endDate(endDate)
                            .startDayOfWeek(startDayOfWeek)
                            .build();
                    return weeklyPeriodRepository.save(newPeriod);
                });
    }

    // 리더 권한 검증 메서드
    private void validateIsLeader(User currentUser, Long studyGroupId) {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new RuntimeException("스터디 그룹 없음"));

        if (!group.getLeader().getId().equals(currentUser.getId())) {
            throw new RuntimeException("리더만 접근할 수 있습니다.");
        }
    }
}

