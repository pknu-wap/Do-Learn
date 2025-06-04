package com.wap.web1.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWeeklyPeriod is a Querydsl query type for WeeklyPeriod
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWeeklyPeriod extends EntityPathBase<WeeklyPeriod> {

    private static final long serialVersionUID = -646398480L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWeeklyPeriod weeklyPeriod = new QWeeklyPeriod("weeklyPeriod");

    public final DatePath<java.time.LocalDate> endDate = createDate("endDate", java.time.LocalDate.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    public final EnumPath<java.time.DayOfWeek> startDayOfWeek = createEnum("startDayOfWeek", java.time.DayOfWeek.class);

    public final QStudyGroup studyGroup;

    public QWeeklyPeriod(String variable) {
        this(WeeklyPeriod.class, forVariable(variable), INITS);
    }

    public QWeeklyPeriod(Path<? extends WeeklyPeriod> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWeeklyPeriod(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWeeklyPeriod(PathMetadata metadata, PathInits inits) {
        this(WeeklyPeriod.class, metadata, inits);
    }

    public QWeeklyPeriod(Class<? extends WeeklyPeriod> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.studyGroup = inits.isInitialized("studyGroup") ? new QStudyGroup(forProperty("studyGroup"), inits.get("studyGroup")) : null;
    }

}

