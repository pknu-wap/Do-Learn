package com.wap.web1.repository;

import com.wap.web1.domain.PersonalTask;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.WeeklyPeriod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PersonalTaskRepository extends JpaRepository<PersonalTask, Long> {

    List<PersonalTask> findAllByStudyMemberAndWeeklyPeriodAndDeletedFalse(
            StudyMember studyMember, WeeklyPeriod weeklyPeriod
    );

    Optional<PersonalTask> findByIdAndDeletedFalse(Long id);

    Optional<PersonalTask> findByIdAndStudyMemberAndDeletedFalse(Long id, StudyMember studyMember);

    List<PersonalTask> findAllByWeeklyPeriod(WeeklyPeriod weeklyPeriod);
}

