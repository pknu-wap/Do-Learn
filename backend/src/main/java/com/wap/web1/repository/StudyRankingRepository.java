package com.wap.web1.repository;

import com.wap.web1.domain.StudyRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudyRankingRepository extends JpaRepository<StudyRanking, Long>, StudyRankingRepositoryCustom {
    List<StudyRanking> findByStudyMember_StudyGroupId(Long studyGroupId);

    @Modifying
    @Query("DELETE FROM StudyRanking sr WHERE sr.studyMember.studyGroup.id = :studyGroupId")
    void deleteAllByStudyGroupId(@Param("studyGroupId") Long studyGroupId);

    @Modifying
    @Query("DELETE FROM StudyRanking sr WHERE sr.weeklyPeriod.id = :weeklyPeriodId AND sr.studyGroup.id = :studyGroupId")
    int deleteByWeeklyPeriodAndStudyGroup(@Param("weeklyPeriodId") Long weeklyPeriodId,
                                          @Param("studyGroupId") Long studyGroupId);

}
