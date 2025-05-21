package com.wap.web1.repository;

import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.User;
import com.wap.web1.dto.GroupMemberCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudyMemberRepository extends JpaRepository<StudyMember, Long> {
    //이미 해당 유저가 스터디에 가입 중인지 확인
    boolean existsByStudyGroupAndUserAndStatus(StudyGroup studyGroup, User user, StudyMember.Status status);

    //현재 ACTIVE 상태인 유저 수 확인(정원 초과 체크용)
    long countByStudyGroupAndStatus(StudyGroup studyGroup, StudyMember.Status status);

    List<StudyMember> findByUserId(Long userId);

    // 특정 스터디 그룹에 속한 멤버 전체 조회
    List<StudyMember> findByStudyGroupId(Long studyGroupId);

    Optional<StudyMember> findByStudyGroupAndUser(StudyGroup studyGroup, User user);

    //매주 초기화
    @Modifying
    @Query("UPDATE StudyMember sm SET sm.AttendanceCount = 0")
    void resetAllweeklyAttendance();

    int countByStudyGroupIdAndStatus(Long studyGroupId, StudyMember.Status status);

    //현재 인원 계산
    @Query("SELECT sm.studyGroup.id AS groupId, COUNT(sm) AS count " +
            "FROM StudyMember sm " +
            "WHERE sm.status = 'ACTIVE' AND sm.studyGroup.id IN :groupIds " +
            "GROUP BY sm.studyGroup.id")
    List<GroupMemberCount> countActiveMembersByGroupIds(@Param("groupIds") List<Long> groupIds);
}
