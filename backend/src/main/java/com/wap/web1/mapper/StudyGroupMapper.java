package com.wap.web1.mapper;

import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.dto.StudyGroupDto;
import com.wap.web1.dto.StudyGroupResponse;
import com.wap.web1.dto.StudyGroupWithMemberCountDto;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.util.ScrollPaginationCollection;

import java.util.List;
import java.util.stream.Collectors;

public class StudyGroupMapper {

    public static StudyGroupResponse<StudyGroupWithMemberCountDto> convertToResponseWithCountDto(
            List<StudyGroupWithMemberCountDto> groups, int size) {

        ScrollPaginationCollection<StudyGroupWithMemberCountDto> scroll =
                ScrollPaginationCollection.of(groups, size);

        return StudyGroupResponse.of(
                scroll.getCurrentScrollItems(),
                scroll.isLastScroll() ? null : scroll.getNextCursor().getId()
        );
    }

    public static StudyGroupResponse<StudyGroupDto> convertToResponse(
            List<StudyGroup> groups, int size, StudyMemberRepository studyMemberRepository) {

        // StudyGroup -> StudyGroupDto 변환
        List<StudyGroupDto> dtos = groups.stream().map(group -> {
            int currentMembers = studyMemberRepository.countByStudyGroup_IdAndStatus(group.getId(), StudyMember.Status.ACTIVE);

            return new StudyGroupDto(
                    group.getId(),
                    group.getName(),
                    group.getMeetingDays(),
                    group.getMeetingTime(),
                    group.getMeetingType(),
                    currentMembers,
                    group.getMaxMembers(),
                    group.getRegion(),
                    group.getCategory(),
                    group.getType(),
                    group.getStartDate()
            );
        }).collect(Collectors.toList());

        // Scroll 처리
        ScrollPaginationCollection<StudyGroupDto> scroll = ScrollPaginationCollection.of(dtos, size);

        return StudyGroupResponse.of(
                scroll.getCurrentScrollItems(),
                scroll.isLastScroll() ? null : scroll.getNextCursor().getId()
        );
    }

}

