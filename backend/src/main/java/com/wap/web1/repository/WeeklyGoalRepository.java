package com.wap.web1.repository;

import com.wap.web1.domain.WeeklyGoal;
import com.wap.web1.domain.WeeklyPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WeeklyGoalRepository extends JpaRepository<WeeklyGoal, Long> {

    boolean existsByStudyGroupIdAndWeeklyPeriodStartDateAndWeeklyPeriodEndDateAndMainCategoryAndDeletedFalse(
            Long studyGroupId,
            LocalDate startDate,
            LocalDate endDate,
            String mainCategory
    );


    List<WeeklyGoal> findByStudyGroupIdAndDeletedFalse(Long studyGroupId);

    Optional<WeeklyGoal> findByIdAndDeletedFalse(Long id);

    List<WeeklyGoal> findByStudyGroupIdAndWeeklyPeriodStartDateAndWeeklyPeriodEndDateAndDeletedFalse(
            Long studyGroupId, LocalDate startDate, LocalDate endDate
    );

    List<WeeklyGoal> findByWeeklyPeriod(WeeklyPeriod weeklyPeriod);

    @Modifying
    @Transactional
    @Query("DELETE FROM WeeklyGoal wg WHERE wg.studyGroup.id = :studyGroupId")
    void deleteAllByStudyGroupId(@Param("studyGroupId") Long studyGroupId);

}

