package com.wap.web1.dto;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * com.wap.web1.dto.QMemberRankingDto is a Querydsl Projection type for MemberRankingDto
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QMemberRankingDto extends ConstructorExpression<MemberRankingDto> {

    private static final long serialVersionUID = 1266641294L;

    public QMemberRankingDto(com.querydsl.core.types.Expression<Long> memberId, com.querydsl.core.types.Expression<String> nickname, com.querydsl.core.types.Expression<Long> completedCount) {
        super(MemberRankingDto.class, new Class<?>[]{long.class, String.class, long.class}, memberId, nickname, completedCount);
    }

}

