package com.wap.web1.dto;

import lombok.Getter;
import java.util.List;

@Getter
public class StudyGroupResponse<T> {
    private final List<T> groups;
    private final Long nextCursor;
    private final String message;

    private StudyGroupResponse(List<T> groups, Long nextCursor, String message) {
        this.groups = groups;
        this.nextCursor = nextCursor;
        this.message = message;
    }

    public static <T> StudyGroupResponse<T> of(List<T> groups, Long nextCursor) {
        return new StudyGroupResponse<>(groups, nextCursor, null);
    }

    public static <T> StudyGroupResponse<T> of(String message) {
        return new StudyGroupResponse<>(null, null, message);
    }
}

