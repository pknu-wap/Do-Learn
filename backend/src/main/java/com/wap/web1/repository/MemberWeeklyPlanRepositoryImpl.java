package com.wap.web1.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.wap.web1.domain.*;
import com.wap.web1.dto.MemberRankingDto;
import com.wap.web1.dto.QMemberRankingDto;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class MemberWeeklyPlanRepositoryImpl implements MemberWeeklyPlanRepositoryCustom{

    private final JPAQueryFactory queryFactory;
    private final EntityManager em;

    @Override
    public List<MemberWeeklyPlan> findAllByMemberAndWeeklyGoalId(StudyMember member,Long weeklyGoalId) {
        QMemberWeeklyPlan plan = QMemberWeeklyPlan.memberWeeklyPlan;
        QWeeklySubGoal subGoal = QWeeklySubGoal.weeklySubGoal;

        return queryFactory
                .selectFrom(plan)
                .join(plan.weeklySubGoal, subGoal).fetchJoin()
                .where(
                        plan.studyMember.eq(member),
                        subGoal.weeklyGoal.id.eq(weeklyGoalId),
                        plan.deleted.isFalse()
                )
                .fetch();
    }

    @Override
    public List<Long> findCompletedSubGoalIdsByMemberAndWeeklyGoalId(Long memberId,Long weeklyGoalId) {
        QMemberWeeklyPlan plan = QMemberWeeklyPlan.memberWeeklyPlan;

        return queryFactory
                .select(plan.weeklySubGoal.id)
                .from(plan)
                .where(
                        plan.studyMember.id.eq(memberId),
                        plan.weeklySubGoal.weeklyGoal.id.eq(weeklyGoalId),
                        plan.completed.isTrue(),
                        plan.deleted.isFalse()
                )
                .distinct()
                .fetch();
    }

    @Override
    public List<MemberRankingDto> getWeeklyRankingForGroup(Long studyGroupId, LocalDate startDate, LocalDate endDate) {
        JPAQueryFactory queryFactory = new JPAQueryFactory(em);
        QMemberWeeklyPlan plan = QMemberWeeklyPlan.memberWeeklyPlan;
        QStudyMember member = QStudyMember.studyMember;
        QUser user = QUser.user;

        return queryFactory
                .select(new QMemberRankingDto(
                        member.id,
                        user.nickname,
                        plan.id.count()
                ))
                .from(plan)
                .join(plan.studyMember,member)
                .join(member.user,user)
                .where(
                        plan.studyMember.studyGroup.id.eq(studyGroupId),
                        plan.completed.isTrue(),
                        plan.deleted.isFalse(),
                        plan.date.between(startDate,endDate)
                )
                .groupBy(member.id,user.nickname)
                .orderBy(plan.id.count().desc())
                .fetch();
    }

    @Override
    public Map<Long, Long> countCompletedByMemberIdsAndPeriod(List<Long> memberIds, Long weeklyPeriodId) {
        QMemberWeeklyPlan plan = QMemberWeeklyPlan.memberWeeklyPlan;

        return queryFactory
                .select(plan.studyMember.id,plan.count())
                .from(plan)
                .where(
                        plan.studyMember.id.in(memberIds),
                        plan.weeklyPeriod.id.eq(weeklyPeriodId),
                        plan.completed.isTrue(),
                        plan.deleted.isFalse()
                )
                .groupBy(plan.studyMember.id)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(0, Long.class),
                        tuple -> tuple.get(1,Long.class)
                ));
    }

    @Override
    public Long countCompletedByMemberIdAndPeriod(Long memberId, Long weeklyPeriodId) {
        QMemberWeeklyPlan plan = QMemberWeeklyPlan.memberWeeklyPlan;

        return queryFactory
                .select(plan.count())
                .from(plan)
                .where(
                        plan.studyMember.id.eq(memberId),
                        plan.weeklyPeriod.id.eq(weeklyPeriodId),
                        plan.completed.isTrue()
                )
                .fetchOne();
    }

}
