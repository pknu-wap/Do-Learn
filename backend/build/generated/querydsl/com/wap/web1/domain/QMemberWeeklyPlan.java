package com.wap.web1.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMemberWeeklyPlan is a Querydsl query type for MemberWeeklyPlan
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMemberWeeklyPlan extends EntityPathBase<MemberWeeklyPlan> {

    private static final long serialVersionUID = 874180306L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMemberWeeklyPlan memberWeeklyPlan = new QMemberWeeklyPlan("memberWeeklyPlan");

    public final BooleanPath completed = createBoolean("completed");

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final EnumPath<java.time.DayOfWeek> dayofWeek = createEnum("dayofWeek", java.time.DayOfWeek.class);

    public final BooleanPath deleted = createBoolean("deleted");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath lastCompletedStatus = createBoolean("lastCompletedStatus");

    public final DateTimePath<java.time.LocalDateTime> lastModifiedAt = createDateTime("lastModifiedAt", java.time.LocalDateTime.class);

    public final QStudyMember studyMember;

    public final BooleanPath weeklyGoalCompleted = createBoolean("weeklyGoalCompleted");

    public final DateTimePath<java.time.LocalDateTime> weeklyGoalCompletedAt = createDateTime("weeklyGoalCompletedAt", java.time.LocalDateTime.class);

    public final QWeeklyPeriod weeklyPeriod;

    public final QWeeklySubGoal weeklySubGoal;

    public QMemberWeeklyPlan(String variable) {
        this(MemberWeeklyPlan.class, forVariable(variable), INITS);
    }

    public QMemberWeeklyPlan(Path<? extends MemberWeeklyPlan> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMemberWeeklyPlan(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMemberWeeklyPlan(PathMetadata metadata, PathInits inits) {
        this(MemberWeeklyPlan.class, metadata, inits);
    }

    public QMemberWeeklyPlan(Class<? extends MemberWeeklyPlan> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.studyMember = inits.isInitialized("studyMember") ? new QStudyMember(forProperty("studyMember"), inits.get("studyMember")) : null;
        this.weeklyPeriod = inits.isInitialized("weeklyPeriod") ? new QWeeklyPeriod(forProperty("weeklyPeriod"), inits.get("weeklyPeriod")) : null;
        this.weeklySubGoal = inits.isInitialized("weeklySubGoal") ? new QWeeklySubGoal(forProperty("weeklySubGoal"), inits.get("weeklySubGoal")) : null;
    }

}

