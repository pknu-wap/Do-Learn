package com.wap.web1.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWeeklyGoal is a Querydsl query type for WeeklyGoal
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWeeklyGoal extends EntityPathBase<WeeklyGoal> {

    private static final long serialVersionUID = -863500542L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWeeklyGoal weeklyGoal = new QWeeklyGoal("weeklyGoal");

    public final BooleanPath deleted = createBoolean("deleted");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath mainCategory = createString("mainCategory");

    public final QStudyGroup studyGroup;

    public final QWeeklyPeriod weeklyPeriod;

    public QWeeklyGoal(String variable) {
        this(WeeklyGoal.class, forVariable(variable), INITS);
    }

    public QWeeklyGoal(Path<? extends WeeklyGoal> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWeeklyGoal(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWeeklyGoal(PathMetadata metadata, PathInits inits) {
        this(WeeklyGoal.class, metadata, inits);
    }

    public QWeeklyGoal(Class<? extends WeeklyGoal> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.studyGroup = inits.isInitialized("studyGroup") ? new QStudyGroup(forProperty("studyGroup"), inits.get("studyGroup")) : null;
        this.weeklyPeriod = inits.isInitialized("weeklyPeriod") ? new QWeeklyPeriod(forProperty("weeklyPeriod"), inits.get("weeklyPeriod")) : null;
    }

}

