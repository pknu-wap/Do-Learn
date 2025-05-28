package com.wap.web1.service;

import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.User;
import com.wap.web1.repository.StudyGroupRepository;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.repository.UserRepository;
import com.wap.web1.response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MainService {

    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyMemberRepository studyMemberRepository;

    public Response joinStudyGroup(Long studyGroupId, Long userId) {
        //유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디 그룹을 찾을 수 없습니다."));

        //강퇴여부 확인
        boolean isBanned = studyMemberRepository.existsByStudyGroupAndUserAndStatus(
                studyGroup, user, StudyMember.Status.BANNED);
        if(isBanned) {
            throw new IllegalArgumentException("강퇴된 사용자 입니다.");
        }

        //중복가입 확인
        boolean alreadyJoined = studyMemberRepository.existsByStudyGroupAndUserAndStatus(
                studyGroup, user, StudyMember.Status.ACTIVE);
        if(alreadyJoined) {
            throw new IllegalArgumentException("이미 가입한 스터디입니다.");
        }

        //정원초과 여부 확인
        long currentMembers = studyMemberRepository.countByStudyGroupAndStatus(
                studyGroup, StudyMember.Status.ACTIVE);
        if(studyGroup.getMaxMembers() != null&& currentMembers >= studyGroup.getMaxMembers()) {
            throw new IllegalArgumentException("스터디 정원이 초과되었습니다.");
        }

        //StudyMember 저장
        StudyMember member = StudyMember.builder()
                .studyGroup(studyGroup)
                .user(user)
                .status(StudyMember.Status.ACTIVE)
                .role(StudyMember.Role.MEMBER)
                .progress(0)
                .build();

        studyMemberRepository.save(member);

        return new Response("스터디에 가입되었습니다.");
    }
}
