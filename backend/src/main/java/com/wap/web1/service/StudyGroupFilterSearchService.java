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
public class StudyGroupFilterSearchService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyMemberRepository studyMemberRepository;

    public StudyGroupFilterSearchService(StudyGroupRepository studyGroupRepository,StudyMemberRepository studyMemberRepository) {
        this.studyGroupRepository = studyGroupRepository;
        this.studyMemberRepository = studyMemberRepository;
    }

    public StudyGroupResponse searchGroups(Long cursor, int size, String groupName, List<Category> categories, List<Region> regions) {
        if(groupName == null || groupName.isBlank()) {
            return StudyGroupResponse.of("검색어를 입력해주세요.");
        }

        PageRequest pageable = PageRequest.of(0, size + 1);

        List<StudyGroup> groups = studyGroupRepository.searchWithFilters(
                groupName,
                (categories != null && !categories.isEmpty()) ? categories : null,
                (regions != null && !regions.isEmpty()) ? regions : null,
                cursor != null ? cursor : 0L,
                pageable
        );

        if(groups.isEmpty()) {
            return StudyGroupResponse.of("해당 데이터가 없습니다.");
        }

        return StudyGroupMapper.convertToResponse(groups,size,studyMemberRepository);
    }
}

