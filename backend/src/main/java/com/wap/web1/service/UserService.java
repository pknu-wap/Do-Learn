package com.wap.web1.service;


import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.User;
import com.wap.web1.dto.*;
import com.wap.web1.repository.StudyGroupRepository;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.repository.UserRepository;
import com.wap.web1.response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class UserService {
    private  final UserRepository userRepository;

    private final StudyMemberRepository studyMemberRepository;
    private final StudyGroupRepository studyGroupRepository;
    public MyInfoDto getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return MyInfoDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .build();
    }

    public MyGroupsDto getMyGroups(Long userId){
        List<StudyMember> memberships = studyMemberRepository.findByUserId(userId);

        List<StudyGroup> groups = memberships.stream()
                .map(StudyMember::getStudyGroup)
                .toList();

        List<Long> groupIds = groups.stream()
                .map(StudyGroup::getId)
                .toList();

        Map<Long, Long> memberCountMap = studyMemberRepository
                .countActiveMembersByGroupIds(groupIds).stream()
                .collect(Collectors.toMap(GroupMemberCount::getGroupId, GroupMemberCount::getCount));


        List<MyStudyGroupDto> studyGroups = groups.stream()
                .map(group -> {
                    int currentMembers = memberCountMap.getOrDefault(group.getId(), 0L).intValue();
                    boolean isLeader = group.getLeader().getId().equals(userId); // 리더인지 확인

                    return MyStudyGroupDto.builder()
                            .id(group.getId())
                            .name(group.getName())
                            .meetingDays(group.getMeetingDays())
                            .meetingTime(group.getMeetingTime())
                            .meetingType(group.getMeetingType())
                            .currentMembers(currentMembers)
                            .maxMembers(group.getMaxMembers())
                            .region(group.getRegion())
                            .category(group.getCategory())
                            .type(group.getType())
                            .startDate(group.getStartDate())
                            .recruitStatus(group.getRecruitStatus())
                            .isLeader(isLeader)
                            .build();
                })
                .collect(Collectors.toList());
        return new MyGroupsDto(userId, studyGroups);
    }

    @Transactional
    public Response updateMyGroup(Long studyGroupId, Long userId, GroupUpdateDto dto){
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디그룹을 찾을 수 없습니다"));

        if(!group.getLeader().getId().equals(userId)){
            throw new IllegalArgumentException("스터디 리더만 수정할 수 있습니다");
        }

        if (dto.getName()!=null) group.setName(dto.getName());
        if (dto.getMaxMembers() != null) {
            int maxMembers = dto.getMaxMembers();
            if (maxMembers < 3 || maxMembers > 12) {
                throw new IllegalArgumentException("스터디 인원은 3명 이상 12명 이하이어야 합니다.");
            }
            group.setMaxMembers(maxMembers);
        }
        if (dto.getNotice() != null) group.setNotice(dto.getNotice());
        if (dto.getMeetingDays() != null) group.setMeetingDays(dto.getMeetingDays());
        if (dto.getMeetingTime() != null) group.setMeetingTime(dto.getMeetingTime());
        if (dto.getMeetingType() != null) group.setMeetingType(dto.getMeetingType());
        if (dto.getRegion() != null) group.setRegion(dto.getRegion());
        if (dto.getCategory() != null) group.setCategory(dto.getCategory());
        if (dto.getType() != null) group.setType(dto.getType());
        if (dto.getStartDate() != null) group.setStartDate(dto.getStartDate());
        if (dto.getRecruitStatus() != null) group.setRecruitStatus(dto.getRecruitStatus());

        return new Response("스터디 정보가 성공적으로 수정되었습니다.");
    }

    @Transactional
    public Response updateMyInfo(Long userId, MyInfoUpdateDto dto){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        //닉네임 검증 및 수정
        if(dto.getNickname() != null){
            String newNickname = dto.getNickname();
            if (newNickname.length() > 10){
                throw new IllegalArgumentException("닉네임은 10자 이내로 입력해야 합니다.");
            }

            boolean isDuplicate = userRepository.existsByNickname(newNickname);
            if (isDuplicate){
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }

            user.setNickname(newNickname);
        }


        if(dto.getProfileImage() != null){
            List<Integer> allowedImages = List.of(1, 2, 3, 4);
            if (!allowedImages.contains(dto.getProfileImage())) {
                throw new IllegalArgumentException(
                        "올바르지 않은 프로필 이미지입니다.");
            }
            user.setProfileImage(dto.getProfileImage());
        }
        return new Response("내 정보가 성공적으로 수정되었습니다.");
    }

}
