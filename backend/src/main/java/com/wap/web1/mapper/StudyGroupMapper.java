package com.wap.web1.mapper;

import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.dto.StudyGroupDto;
import com.wap.web1.dto.StudyGroupResponse;
import com.wap.web1.repository.StudyMemberRepository;

import java.util.List;
import java.util.stream.Collectors;

public class StudyGroupMapper {

    public static StudyGroupResponse convertToResponse(List<StudyGroup> groups, int size, StudyMemberRepository studyMemberRepository) {
        List<StudyGroupDto> dtos = groups.stream()
                .map(group -> {
                    long memberCount = studyMemberRepository.countByStudyGroupAndStatus(group, StudyMember.Status.ACTIVE);
                    return new StudyGroupDto(
                            group.getId(),
                            group.getName(),
                            group.getMeetingDays(),
                            group.getMeetingTime(),
                            group.getMeetingType(),
                            (int) memberCount,
                            group.getMaxMembers(),
                            group.getRegion(),
                            group.getCategory(),
                            group.getType()
                    );
                })
                .collect(Collectors.toList());

        ScrollPaginationCollection<StudyGroupDto> scroll = ScrollPaginationCollection.of(dtos, size);
        return StudyGroupResponse.of(
                scroll.getCurrentScrollItems(),
                scroll.isLastScroll() ? null : scroll.getNextCursor().getId()
        );
    }
}
