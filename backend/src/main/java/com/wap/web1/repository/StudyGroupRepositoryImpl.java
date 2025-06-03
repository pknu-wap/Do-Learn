package com.wap.web1.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.wap.web1.domain.*;
import com.wap.web1.dto.StudyGroupWithMemberCountDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

import static com.wap.web1.domain.QStudyGroup.studyGroup;
import static com.wap.web1.domain.QStudyMember.studyMember;

@Repository
@RequiredArgsConstructor
public class StudyGroupRepositoryImpl implements StudyGroupRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<StudyGroupWithMemberCountDto> findStudyGroupsWithMemberCount(
            Long cursor, int size, List<String> categories, List<String> regions) {

        BooleanExpression categoryPredicate = buildCategoryPredicate(categories);
        BooleanExpression regionPredicate = buildRegionPredicate(regions);

        return queryFactory
                .select(Projections.constructor(StudyGroupWithMemberCountDto.class,
                        studyGroup.id,
                        studyGroup.name,
                        studyGroup.meetingDays,
                        studyGroup.meetingTime,
                        studyGroup.meetingType,
                        studyMember.id.count().intValue(),
                        studyGroup.maxMembers,
                        studyGroup.region,
                        studyGroup.category,
                        studyGroup.type,
                        studyGroup.startDate
                ))
                .from(studyGroup)
                .leftJoin(studyMember).on(
                        studyMember.studyGroup.eq(studyGroup)
                                .and(studyMember.status.eq(StudyMember.Status.ACTIVE))
                )
                .where(
                    studyGroup.recruitStatus.eq(RecruitStatus.RECRUITING),
                    cursor != null ? studyGroup.id.gt(cursor) : null,
                    categoryPredicate,
                    regionPredicate
                )
                .groupBy(studyGroup.id)
                .having(studyMember.count().lt(studyGroup.maxMembers))
                .orderBy(studyGroup.id.asc())
                .limit(size + 1)
                .fetch();
    }

    private BooleanExpression buildCategoryPredicate(List<String> categories) {
        if(categories == null || categories.isEmpty()) {
            return null;
        }
        return studyGroup.category.in(
                categories.stream()
                        .map(Category::valueOf)
                        .collect(Collectors.toList())
        );
    }

    private BooleanExpression buildRegionPredicate(List<String> regions) {
        if(regions == null || regions.isEmpty()) {
            return null;
        }
        return studyGroup.region.in(
                regions.stream()
                        .map(Region::valueOf)
                        .collect(Collectors.toList())
        );
    }
}
