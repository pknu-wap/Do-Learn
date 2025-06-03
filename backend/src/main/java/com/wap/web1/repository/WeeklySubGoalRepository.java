package com.wap.web1.repository;

import com.wap.web1.domain.WeeklySubGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WeeklySubGoalRepository extends JpaRepository<WeeklySubGoal, Long> {

    List<WeeklySubGoal> findByWeeklyGoalIdAndDeletedFalse(Long weeklyGoalId);

    @Query("SELECT w.id FROM WeeklySubGoal w WHERE w.weeklyGoal.id = :weeklyGoalId AND w.deleted = false")
    List<Long> findIdsByWeeklyGoalIdAndDeletedFalse(@Param("weeklyGoalId") Long weeklyGoalId);

    List<WeeklySubGoal> findByWeeklyGoalIdInAndDeletedFalse(List<Long> goalIds);

    @Query("""
            SELECT sg FROM WeeklySubGoal sg
            WHERE sg.weeklyGoal.studyGroup.id = :groupId
            AND sg.weeklyGoal.weeklyPeriod.id = :weeklyPeriodId
            AND sg.deleted = false
            """ )
    List<WeeklySubGoal> findSubGoalsByGroupAndWeeklyPeriodId(
            @Param("groupId") Long groupId,
            @Param("weeklyPeriodId") Long weeklyPeriodId
    );

    @Query("""
            SELECT COUNT(sg) FROM WeeklySubGoal sg
            WHERE sg.weeklyGoal.studyGroup.Id = :groupId
            AND sg.weeklyGoal.weeklyPeriod.id = :weeklyPeriodId
            AND sg.deleted = false
            """)
    int countSubGoalsByGroupAndWeeklyPeriodId(@Param("groupId") Long groupId, @Param("weeklyPeriodId")Long weeklyPeriodId);

    List<WeeklySubGoal> findByWeeklyGoalId(Long weeklyGoalId);

}

