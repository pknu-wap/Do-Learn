package com.wap.web1.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class MemberRankingDto {
    private Long memberId;
    private String nickname;
    private Long completedCount;

    @QueryProjection
    public MemberRankingDto(Long memberId, String nickname, Long completedCount) {
        this.memberId = memberId;
        this.nickname = nickname;
        this.completedCount = completedCount;
    }
}
