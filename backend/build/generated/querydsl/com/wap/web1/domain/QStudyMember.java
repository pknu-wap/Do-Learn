package com.wap.web1.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStudyMember is a Querydsl query type for StudyMember
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStudyMember extends EntityPathBase<StudyMember> {

    private static final long serialVersionUID = -1802238027L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStudyMember studyMember = new QStudyMember("studyMember");

    public final NumberPath<Integer> AttendanceCount = createNumber("AttendanceCount", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> progress = createNumber("progress", Integer.class);

    public final EnumPath<StudyMember.Role> role = createEnum("role", StudyMember.Role.class);

    public final EnumPath<StudyMember.Status> status = createEnum("status", StudyMember.Status.class);

    public final QStudyGroup studyGroup;

    public final QUser user;

    public QStudyMember(String variable) {
        this(StudyMember.class, forVariable(variable), INITS);
    }

    public QStudyMember(Path<? extends StudyMember> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStudyMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStudyMember(PathMetadata metadata, PathInits inits) {
        this(StudyMember.class, metadata, inits);
    }

    public QStudyMember(Class<? extends StudyMember> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.studyGroup = inits.isInitialized("studyGroup") ? new QStudyGroup(forProperty("studyGroup"), inits.get("studyGroup")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}

