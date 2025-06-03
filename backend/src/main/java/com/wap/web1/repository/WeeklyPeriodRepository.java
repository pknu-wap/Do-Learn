package com.wap.web1.repository;

import com.wap.web1.domain.WeeklyPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WeeklyPeriodRepository extends JpaRepository<WeeklyPeriod, Long> {
    Optional<WeeklyPeriod> findByStudyGroupIdAndStartDateAndEndDate(Long studyGroupId, LocalDate startDate, LocalDate endDate);

    @Query("""
        SELECT w FROM WeeklyPeriod w
        WHERE w.studyGroup.id = :groupId
          AND :date BETWEEN w.startDate AND w.endDate
    """)
    Optional<WeeklyPeriod> findPeriodByGroupAndDate(@Param("groupId") Long groupId, @Param("date") LocalDate date);

    List<WeeklyPeriod> findAllByEndDate(LocalDate endDate);

    @Modifying
    @Transactional
    @Query("DELETE FROM WeeklyPeriod wp WHERE wp.studyGroup.id = :studyGroupId")
    void deleteAllByStudyGroupId(Long studyGroupId);

}
