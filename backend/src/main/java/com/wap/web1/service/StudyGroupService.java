package com.wap.web1.service;

import com.wap.web1.domain.*;
import com.wap.web1.dto.AttendanceCalendarDto;
import com.wap.web1.dto.GroupMembersDto;
import com.wap.web1.dto.GroupNoticeDto;
import com.wap.web1.dto.StudyGroupCreateDto;
import com.wap.web1.repository.*;
import com.wap.web1.response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class StudyGroupService {
    private final AttendanceRepository attendanceRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final StudyRankingRepository studyRankingRepository;
    @Transactional
    public Response createStudyGroup(StudyGroupCreateDto dto, Long userId){
        if (studyGroupRepository.findByName(dto.getName()).isPresent()){
            throw new IllegalArgumentException("이미 존재하는 그룹명입니다.");
        }

        User leader = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("리더 유저를 찾을 수 없습니다."));

        if (dto.getMaxMembers() < 3 || dto.getMaxMembers() > 12) {
            throw new IllegalArgumentException("스터디 인원은 3명 이상 12명 이하이어야 합니다.");
        }

        Region region = dto.getRegion() != null ? dto.getRegion() : Region.해당없음;

        //스터디 그룹 생성
        StudyGroup group = StudyGroup.builder()
                .name(dto.getName())
                .maxMembers(dto.getMaxMembers())
                .leader(leader)
                .notice(dto.getNotice())
                .meetingDays(dto.getMeetingDays())
                .meetingTime(dto.getMeetingTime())
                .meetingType(dto.getMeetingType())
                .region(region)
                .category(dto.getCategory())
                .type(dto.getType())
                .startDate(dto.getStartDate())
                .recruitStatus(RecruitStatus.RECRUITING)// 기본값으로 모집중
                .build();

        studyGroupRepository.save(group);

        //StudyMember에 리더 등록
        StudyMember leaderMember = StudyMember.builder()
                .studyGroup(group)
                .user(leader)
                .role(StudyMember.Role.LEADER)
                .status(StudyMember.Status.ACTIVE)
                .progress(0)
                .build();

        studyMemberRepository.save(leaderMember);

        return new Response("스터디 정보가 성공적으로 생성되었습니다.");
    }

    @Transactional(readOnly = true)
    public GroupMembersDto getStudyGroupMembers(Long studyGroupId) {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디그룹을 찾을 수 없습니다"));

        List<StudyRanking> rankings = studyRankingRepository.findByStudyMember_StudyGroupId(studyGroupId);

        //랭킹 정보를 Map<studyMemberId, ranking>으로 변환
        Map<Long, Integer> memberIdToRankMap = rankings.stream()
                .collect(Collectors.toMap(
                        r -> r.getStudyMember().getId(),
                        StudyRanking::getRanking
                ));

        List<StudyMember> members = studyMemberRepository.findByStudyGroupId(studyGroupId);
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));

        List<GroupMembersDto.MemberDto> memberDtos = members.stream()
                .filter(member -> member.getStatus() == StudyMember.Status.ACTIVE)
                .map(member -> {
                    User user = member.getUser();

                    boolean attendedToday = attendanceRepository.existsByStudyGroupAndUserAndDate(group, user, today);

                    // 출석 안 했으면 무조건 5번 이미지
                    int profileImage;
                    if (!attendedToday) {
                        profileImage = 5;
                    } else {
                        int rank = memberIdToRankMap.getOrDefault(member.getId(), 0);
                        profileImage = switch (rank) {
                            case 1 -> 1;
                            case 2 -> 2;
                            case 3 -> 3;
                            default -> 4;
                        };
                    }

                    return GroupMembersDto.MemberDto.builder()
                            .userId(member.getUser().getId())
                            .nickname(member.getUser().getNickname())
                            .profileImage(profileImage)
                            .build();
                })
                .collect(Collectors.toList());


        return GroupMembersDto.builder()
                .studyGroupId(group.getId())
                .members(memberDtos)
                .build();
    }

    @Transactional(readOnly = true)
    public GroupNoticeDto getNotice(Long studyGroupId){
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(()->new IllegalArgumentException("스터디 그룹을 찾을 수 없습니다."));
        return new GroupNoticeDto(group.getId(),group.getNotice());
    }

    @Transactional
    public void takeAttendance(Long studyGroupId, Long userId) {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디그룹을 찾을 수 없습니다"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        StudyMember member = studyMemberRepository.findByStudyGroupAndUser(group, user)
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디 그룹의 멤버가 아닙니다."));

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));

        boolean alreadyChecked = attendanceRepository.existsByStudyGroupAndUserAndDate(group, user, today);
        if(alreadyChecked){
            throw new IllegalArgumentException("이미 오늘 출석을 완료했습니다.");
        }

        //출석 저장
        Attendance attendance = Attendance.builder()
                .studyGroup(group)
                .user(user)
                .date(today)
                .status(Attendance.Status.PRESENT)
                .build();
        attendanceRepository.save(attendance);

        //출석 횟수 증가
        member.setAttendanceCount(member.getAttendanceCount() + 1);
    }

    @Transactional(readOnly = true)
    public List<AttendanceCalendarDto> getMonthlyAttendance(Long studyGroupId, Long userId, int year, int month){
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디그룹을 찾을 수 없습니다"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        List<Attendance> attendances = attendanceRepository.findByStudyGroupAndUserAndMonth(group, user, year, month);

        return attendances.stream()
                .map(att -> new AttendanceCalendarDto(att.getDate(), att.getStatus()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public String getGroupName(Long studyGroupId){
        return studyGroupRepository.findById(studyGroupId)
                .orElseThrow(()-> new IllegalArgumentException("스터디 그룹을 찾을 수 없습니다."))
                .getName();
    }

    @Transactional
    public Response leaveStudyGroup(Long studyGroupId, Long userId){
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디그룹을 찾을 수 없습니다"));
        StudyMember member = studyMemberRepository.findByStudyGroupAndUser(group,
                        userRepository.findById(userId)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")))
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디 그룹의 멤버가 아닙니다."));
        if(group.getLeader().getId().equals(userId)){
            throw new IllegalArgumentException("방장은 탈퇴할 수 없습니다.");
        }
        if(member.getStatus() != StudyMember.Status.ACTIVE){
            throw new IllegalArgumentException("이미 탈퇴했거나 강퇴된 상태입니다.");
        }
        member.setStatus(StudyMember.Status.LEFT);
        return new Response("스터디에서 성공적으로 탈퇴했습니다.");
    }
}
