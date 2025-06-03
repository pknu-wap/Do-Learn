

package com.wap.web1.service;

import com.wap.web1.dto.StudyGroupResponse;
import com.wap.web1.dto.StudyGroupWithMemberCountDto;
import com.wap.web1.repository.StudyGroupRepository;
import com.wap.web1.mapper.StudyGroupMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudyGroupListService {

    private final StudyGroupRepository studyGroupRepository;

    public StudyGroupListService(StudyGroupRepository studyGroupRepository) {
        this.studyGroupRepository = studyGroupRepository;
    }

    public StudyGroupResponse<StudyGroupWithMemberCountDto> getStudyGroups(
            Long cursor, int size, List<String> categories, List<String> regions) {

        List<StudyGroupWithMemberCountDto> studyGroups =
                studyGroupRepository.findStudyGroupsWithMemberCount(cursor, size, categories, regions);

        if (studyGroups.isEmpty()) {
            return StudyGroupResponse.of("해당 데이터가 없습니다.");
        }

        return StudyGroupMapper.convertToResponseWithCountDto(studyGroups, size);
    }
}
