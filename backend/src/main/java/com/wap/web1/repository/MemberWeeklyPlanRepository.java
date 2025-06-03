package com.wap.web1.repository;

import com.wap.web1.domain.MemberWeeklyPlan;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.WeeklyPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MemberWeeklyPlanRepository extends JpaRepository<MemberWeeklyPlan, Long>, MemberWeeklyPlanRepositoryCustom {

    Optional<MemberWeeklyPlan> findByIdAndDeletedFalse(Long id);

    List<MemberWeeklyPlan> findAllByStudyMemberAndWeeklyPeriodAndDeletedFalse(
            StudyMember studyMember, WeeklyPeriod weeklyPeriod
    );

    Optional<MemberWeeklyPlan> findByIdAndStudyMemberAndDeletedFalse(Long id, StudyMember studyMember);

    List<MemberWeeklyPlan> findAllByWeeklyPeriod(WeeklyPeriod weeklyPeriod);

    @Modifying
    @Transactional
    @Query("""
        DELETE FROM MemberWeeklyPlan mwp
        WHERE mwp.weeklySubGoal.id IN (
            SELECT wsg.id FROM WeeklySubGoal wsg
            WHERE wsg.weeklyGoal.id IN (
                SELECT wg.id FROM WeeklyGoal wg
                WHERE wg.studyGroup.id = :studyGroupId
            )
        )
    """)
    void deleteAllByStudyGroupId(@Param("studyGroupId") Long studyGroupId);

}


