package com.wap.web1.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStudyRanking is a Querydsl query type for StudyRanking
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStudyRanking extends EntityPathBase<StudyRanking> {

    private static final long serialVersionUID = -5574021L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStudyRanking studyRanking = new QStudyRanking("studyRanking");

    public final NumberPath<Integer> completedSubGoals = createNumber("completedSubGoals", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> ranking = createNumber("ranking", Integer.class);

    public final NumberPath<Integer> rankLevel = createNumber("rankLevel", Integer.class);

    public final QStudyGroup studyGroup;

    public final QStudyMember studyMember;

    public final QWeeklyPeriod weeklyPeriod;

    public QStudyRanking(String variable) {
        this(StudyRanking.class, forVariable(variable), INITS);
    }

    public QStudyRanking(Path<? extends StudyRanking> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStudyRanking(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStudyRanking(PathMetadata metadata, PathInits inits) {
        this(StudyRanking.class, metadata, inits);
    }

    public QStudyRanking(Class<? extends StudyRanking> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.studyGroup = inits.isInitialized("studyGroup") ? new QStudyGroup(forProperty("studyGroup"), inits.get("studyGroup")) : null;
        this.studyMember = inits.isInitialized("studyMember") ? new QStudyMember(forProperty("studyMember"), inits.get("studyMember")) : null;
        this.weeklyPeriod = inits.isInitialized("weeklyPeriod") ? new QWeeklyPeriod(forProperty("weeklyPeriod"), inits.get("weeklyPeriod")) : null;
    }

}

