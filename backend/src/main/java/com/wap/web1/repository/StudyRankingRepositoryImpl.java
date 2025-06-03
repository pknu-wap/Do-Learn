package com.wap.web1.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.wap.web1.domain.QStudyMember;
import com.wap.web1.domain.QStudyRanking;
import com.wap.web1.domain.QUser;
import com.wap.web1.dto.StudyRankDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class StudyRankingRepositoryImpl implements StudyRankingRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<StudyRankDto> findRankingDtos(Long weeklyPeriodId, Long studyGroupId) {
        QStudyRanking sr = QStudyRanking.studyRanking;
        QStudyMember sm = QStudyMember.studyMember;
        QUser user = QUser.user;

        return queryFactory
                .select(Projections.constructor(StudyRankDto.class,
                        sr.id,
                        sr.weeklyPeriod.id,
                        sr.studyGroup.id,
                        sm.id,
                        user.nickname,
                        sr.completedSubGoals,
                        sr.rankLevel,
                        sr.ranking
                ))
                .from(sr)
                .join(sr.studyMember, sm)
                .join(sm.user, user)
                .where(
                        sr.weeklyPeriod.id.eq(weeklyPeriodId),
                        sr.studyGroup.id.eq(studyGroupId)
                )
                .fetch();
    }
}
