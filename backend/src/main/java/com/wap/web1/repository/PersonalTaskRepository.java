package com.wap.web1.repository;

import com.wap.web1.domain.PersonalTask;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.WeeklyPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalTaskRepository extends JpaRepository<PersonalTask, Long> {

    List<PersonalTask> findAllByStudyMemberAndWeeklyPeriodAndDeletedFalse(
            StudyMember studyMember, WeeklyPeriod weeklyPeriod
    );

    Optional<PersonalTask> findByIdAndDeletedFalse(Long id);

    Optional<PersonalTask> findByIdAndStudyMemberAndDeletedFalse(Long id, StudyMember studyMember);

    List<PersonalTask> findAllByWeeklyPeriod(WeeklyPeriod weeklyPeriod);

    @Modifying
    @Transactional
    @Query("""
    DELETE FROM PersonalTask pt
    WHERE pt.studyMember.id IN (
        SELECT sm.id FROM StudyMember sm WHERE sm.studyGroup.id = :studyGroupId
    )
""")
    void deleteAllByStudyGroupId(@Param("studyGroupId") Long studyGroupId);

}

