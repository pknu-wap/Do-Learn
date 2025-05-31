package com.wap.web1.service;

import com.wap.web1.domain.Category;
import com.wap.web1.domain.Region;
import com.wap.web1.domain.StudyGroup;
import com.wap.web1.dto.StudyGroupResponse;
import com.wap.web1.repository.StudyGroupRepository;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.mapper.StudyGroupMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudyGroupListService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyMemberRepository studyMemberRepository;

    public StudyGroupListService(StudyGroupRepository studyGroupRepository,StudyMemberRepository studyMemberRepository) {
        this.studyGroupRepository = studyGroupRepository;
        this.studyMemberRepository = studyMemberRepository;
    }

    public StudyGroupResponse getStudyGroups(Long cursor, int size, List<Category> categories, List<Region> regions) {
        PageRequest pageable = PageRequest.of(0, size + 1);

        List<StudyGroup> studyGroups = studyGroupRepository.findByFilters(
                (categories != null && !categories.isEmpty()) ? categories : null,
                (regions != null && !regions.isEmpty()) ? regions : null,
                cursor != null ? cursor : 0L,
                pageable
        );

        if(studyGroups.isEmpty()) {
            return StudyGroupResponse.of("해당 목록이 없습니다.");
        }

        return StudyGroupMapper.convertToResponse(studyGroups,size,studyMemberRepository);
    }
}
