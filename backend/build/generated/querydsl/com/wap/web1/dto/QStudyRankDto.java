package com.wap.web1.dto;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * com.wap.web1.dto.QStudyRankDto is a Querydsl Projection type for StudyRankDto
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QStudyRankDto extends ConstructorExpression<StudyRankDto> {

    private static final long serialVersionUID = -1508732139L;

    public QStudyRankDto(com.querydsl.core.types.Expression<Long> id, com.querydsl.core.types.Expression<Long> weeklyPeriodId, com.querydsl.core.types.Expression<Long> studyGroupId, com.querydsl.core.types.Expression<Long> studyMemberId, com.querydsl.core.types.Expression<String> nickname, com.querydsl.core.types.Expression<Integer> completedSubGoals, com.querydsl.core.types.Expression<Integer> rankLevel, com.querydsl.core.types.Expression<Integer> ranking) {
        super(StudyRankDto.class, new Class<?>[]{long.class, long.class, long.class, long.class, String.class, int.class, int.class, int.class}, id, weeklyPeriodId, studyGroupId, studyMemberId, nickname, completedSubGoals, rankLevel, ranking);
    }

}

