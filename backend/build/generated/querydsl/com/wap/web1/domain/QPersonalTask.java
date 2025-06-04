package com.wap.web1.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPersonalTask is a Querydsl query type for PersonalTask
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPersonalTask extends EntityPathBase<PersonalTask> {

    private static final long serialVersionUID = -1131302861L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPersonalTask personalTask = new QPersonalTask("personalTask");

    public final BooleanPath completed = createBoolean("completed");

    public final StringPath content = createString("content");

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final EnumPath<java.time.DayOfWeek> dayofWeek = createEnum("dayofWeek", java.time.DayOfWeek.class);

    public final BooleanPath deleted = createBoolean("deleted");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath lastCompletedStatus = createBoolean("lastCompletedStatus");

    public final DateTimePath<java.time.LocalDateTime> lastModifiedAt = createDateTime("lastModifiedAt", java.time.LocalDateTime.class);

    public final QStudyMember studyMember;

    public final QWeeklyPeriod weeklyPeriod;

    public QPersonalTask(String variable) {
        this(PersonalTask.class, forVariable(variable), INITS);
    }

    public QPersonalTask(Path<? extends PersonalTask> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPersonalTask(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPersonalTask(PathMetadata metadata, PathInits inits) {
        this(PersonalTask.class, metadata, inits);
    }

    public QPersonalTask(Class<? extends PersonalTask> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.studyMember = inits.isInitialized("studyMember") ? new QStudyMember(forProperty("studyMember"), inits.get("studyMember")) : null;
        this.weeklyPeriod = inits.isInitialized("weeklyPeriod") ? new QWeeklyPeriod(forProperty("weeklyPeriod"), inits.get("weeklyPeriod")) : null;
    }

}

