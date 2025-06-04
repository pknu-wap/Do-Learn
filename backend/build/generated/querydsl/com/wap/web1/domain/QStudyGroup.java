package com.wap.web1.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStudyGroup is a Querydsl query type for StudyGroup
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStudyGroup extends EntityPathBase<StudyGroup> {

    private static final long serialVersionUID = -894572028L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStudyGroup studyGroup = new QStudyGroup("studyGroup");

    public final EnumPath<Category> category = createEnum("category", Category.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QUser leader;

    public final NumberPath<Integer> maxMembers = createNumber("maxMembers", Integer.class);

    public final StringPath meetingDays = createString("meetingDays");

    public final StringPath meetingTime = createString("meetingTime");

    public final StringPath meetingType = createString("meetingType");

    public final StringPath name = createString("name");

    public final StringPath notice = createString("notice");

    public final EnumPath<RecruitStatus> recruitStatus = createEnum("recruitStatus", RecruitStatus.class);

    public final EnumPath<Region> region = createEnum("region", Region.class);

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    public final StringPath type = createString("type");

    public QStudyGroup(String variable) {
        this(StudyGroup.class, forVariable(variable), INITS);
    }

    public QStudyGroup(Path<? extends StudyGroup> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStudyGroup(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStudyGroup(PathMetadata metadata, PathInits inits) {
        this(StudyGroup.class, metadata, inits);
    }

    public QStudyGroup(Class<? extends StudyGroup> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.leader = inits.isInitialized("leader") ? new QUser(forProperty("leader")) : null;
    }

}

