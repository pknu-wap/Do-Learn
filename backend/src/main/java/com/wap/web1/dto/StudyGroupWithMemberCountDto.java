package com.wap.web1.dto;

import com.wap.web1.domain.Category;
import com.wap.web1.domain.Region;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class StudyGroupWithMemberCountDto {
    private Long id;
    private String name;
    private String meetingDays;
    private String meetingTime;
    private String meetingType;
    private Integer currentMembers;
    private Integer maxMembers;
    private Region region;
    private Category category;
    private String type;
    private LocalDate startDate;
}
