package com.wap.web1.repository;

import com.wap.web1.domain.MemberWeeklyPlan;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.WeeklyPeriod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberWeeklyPlanRepository extends JpaRepository<MemberWeeklyPlan, Long>, MemberWeeklyPlanRepositoryCustom {

    Optional<MemberWeeklyPlan> findByIdAndDeletedFalse(Long id);

    List<MemberWeeklyPlan> findAllByStudyMemberAndWeeklyPeriodAndDeletedFalse(
            StudyMember studyMember, WeeklyPeriod weeklyPeriod
    );

    Optional<MemberWeeklyPlan> findByIdAndStudyMemberAndDeletedFalse(Long id, StudyMember studyMember);

    List<MemberWeeklyPlan> findAllByWeeklyPeriod(WeeklyPeriod weeklyPeriod);
}


