package com.wap.web1.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWeeklySubGoal is a Querydsl query type for WeeklySubGoal
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWeeklySubGoal extends EntityPathBase<WeeklySubGoal> {

    private static final long serialVersionUID = 246304548L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWeeklySubGoal weeklySubGoal = new QWeeklySubGoal("weeklySubGoal");

    public final StringPath content = createString("content");

    public final BooleanPath deleted = createBoolean("deleted");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QWeeklyGoal weeklyGoal;

    public QWeeklySubGoal(String variable) {
        this(WeeklySubGoal.class, forVariable(variable), INITS);
    }

    public QWeeklySubGoal(Path<? extends WeeklySubGoal> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWeeklySubGoal(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWeeklySubGoal(PathMetadata metadata, PathInits inits) {
        this(WeeklySubGoal.class, metadata, inits);
    }

    public QWeeklySubGoal(Class<? extends WeeklySubGoal> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.weeklyGoal = inits.isInitialized("weeklyGoal") ? new QWeeklyGoal(forProperty("weeklyGoal"), inits.get("weeklyGoal")) : null;
    }

}

