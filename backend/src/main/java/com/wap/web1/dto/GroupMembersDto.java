package com.wap.web1.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GroupMembersDto {
    private Long studyGroupId;
    private List<MemberDto> members;

    @Getter
    @Builder
    public static class MemberDto{
        private Long userId;
        private String nickname;
        private Integer profileImage;
    }

}
