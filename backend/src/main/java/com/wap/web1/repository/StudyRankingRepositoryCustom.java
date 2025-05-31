package com.wap.web1.repository;

import com.wap.web1.dto.StudyRankDto;

import java.util.List;

public interface StudyRankingRepositoryCustom {
    List<StudyRankDto> findRankingDtos (Long weeklyPeriodId, Long studyGroupId);
}
