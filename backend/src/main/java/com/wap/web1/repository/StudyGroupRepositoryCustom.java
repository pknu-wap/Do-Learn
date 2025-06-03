package com.wap.web1.repository;

import com.wap.web1.dto.StudyGroupWithMemberCountDto;

import java.util.List;

public interface StudyGroupRepositoryCustom {
    List<StudyGroupWithMemberCountDto> findStudyGroupsWithMemberCount(
            Long cursor, int size, List<String> categories, List<String> regions);
}
