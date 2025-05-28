package com.wap.web1.repository;

import com.wap.web1.domain.Attendance;
import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    boolean existsByStudyGroupAndUserAndDate(StudyGroup studyGroup, User user, LocalDate date);

    @Query("SELECT a FROM Attendance a " +
            "WHERE a.studyGroup = :studyGroup " +
            "AND a.user = :user " +
            "AND YEAR(a.date) = :year " +
            "AND MONTH(a.date) = :month")
    List<Attendance> findByStudyGroupAndUserAndMonth(
            @Param("studyGroup") StudyGroup studyGroup,
            @Param("user") User user,
            @Param("year") int year,
            @Param("month") int month
    );

    @Modifying
    @Query("DELETE FROM Attendance a WHERE a.studyGroup.id = :studyGroupId")
    void deleteAllByStudyGroupId(@Param("studyGroupId") Long studyGroupId);

}
