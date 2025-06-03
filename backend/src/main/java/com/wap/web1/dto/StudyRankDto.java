package com.wap.web1.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@Builder
public class StudyRankDto {
    private Long id;
    private Long weeklyPeriodId;
    private Long studyGroupId;
    private Long studyMemberId;
    private String nickname;
    private int completedSubGoals;
    private Integer rankLevel;
    private Integer ranking;

    @QueryProjection
    public StudyRankDto(Long id, Long weeklyPeriodId, Long studyGroupId,
                        Long studyMemberId, String nickname, int completedSubGoals,
                        Integer rankLevel, Integer ranking) {
        this.id = id;
        this.weeklyPeriodId = weeklyPeriodId;
        this.studyGroupId = studyGroupId;
        this.studyMemberId = studyMemberId;
        this.nickname = nickname;
        this.completedSubGoals = completedSubGoals;
        this.rankLevel = rankLevel;
        this.ranking =ranking;
    }
}
